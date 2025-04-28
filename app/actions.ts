"use server";

import { auth } from "@/auth";
import { SpotifyTrack } from "@/app/types/spotify";
import { rateLimit, redis } from "./redis";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "./openai";
import * as cheerio from "cheerio";

export async function getUserFavorites(email: string) {
  const value = (await redis.get(`v1/${email}/favorites`)) || [];
  return value as SpotifyTrack[];
}

export async function hasUserFavorite(email: string, trackId: string) {
  const favorites = await getUserFavorites(email);
  return favorites.some((favorite) => favorite.id === trackId);
}

export async function addFavorite(track: SpotifyTrack) {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const favorites = await getUserFavorites(session.user.email);

  const data = await redis.set(`v1/${session.user.email}/favorites`, [
    ...favorites,
    track,
  ]);

  return { status: "success" };
}

export async function removeFavorite(track: SpotifyTrack) {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const favorites = await getUserFavorites(session.user.email);

  const data = await redis.set(
    `v1/${session.user.email}/favorites`,
    favorites.filter((favoriteTrack) => favoriteTrack.id !== track.id)
  );

  return { status: "success" };
}

export async function toggleFavorite(args: {
  track: SpotifyTrack;
  email: string;
  operation: "add" | "remove";
}) {
  if (args.operation === "add") {
    return addFavorite(args.track);
  } else {
    return removeFavorite(args.track);
  }
}

const difficultySchema = z.enum(["easy", "medium", "hard"]);

export type TrackDifficulty = z.infer<typeof difficultySchema>;

export async function getTrackDifficulty(track: SpotifyTrack): Promise<{
  difficulty: TrackDifficulty;
}> {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  // Try to get difficulty from KV cache first
  try {
    const cachedDifficulty = await redis.get(`difficulty/${track.id}`);
    if (cachedDifficulty) {
      console.log("Cache hit for difficulty:", track.id);
      return { difficulty: cachedDifficulty as TrackDifficulty };
    }
  } catch (error) {
    console.error("Error reading difficulty from KV cache:", error);
  }

  const email = session.user.email;

  const { success } = await rateLimit.limit(`${email}/ai`);

  if (!success) {
    throw new Error("Rate limit exceeded");
  }

  const lyrics = await getLyrics(track);

  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      difficulty: difficultySchema,
    }),
    prompt: `
    Given the lyrics of this song, determine the difficulty of the song for learning the origin language of the song as an english speaker.

    Lyrics:
    ${lyrics}
    `,
  });

  // Store difficulty in KV cache
  try {
    await redis.set(`difficulty/${track.id}`, result.object.difficulty);
    console.log("Cached difficulty for:", track.id);
  } catch (error) {
    console.error("Error writing difficulty to KV cache:", error);
  }

  return result.object;
}

export async function getCachedLyrics(
  track: Pick<SpotifyTrack, "id">
): Promise<string | null> {
  try {
    const cachedLyrics = await redis.get(`lyrics/${track.id}`);
    if (cachedLyrics) {
      console.log("Cache hit for lyrics:", track.id);
      return cachedLyrics as string;
    }
    return null;
  } catch (error) {
    console.error("Error reading from KV cache:", error);
    return null;
  }
}

export async function getLyrics(track: SpotifyTrack): Promise<string | null> {
  const cachedLyrics = await getCachedLyrics(track);
  if (cachedLyrics) {
    return cachedLyrics;
  }

  const response = await fetch(
    `https://api.genius.com/search?q=${encodeURIComponent(
      `${track.name} ${track.artists[0].name}`
    )}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
      },
    }
  );

  const results = (await response.json()) as {
    response: {
      hits: [
        {
          type: string;
          result: {
            id: number;
            api_path: string;
            url: string;
          };
        }
      ];
    };
  };

  const firstHit = results.response.hits.at(0)?.result;

  if (!firstHit) {
    console.log("No lyrics found for:", track.id);
    return null;
  }

  // Get the song URL from the API result
  const rawSongURL = firstHit.url;

  if (!rawSongURL) {
    console.log("No song URL found for:", track.id);
    return null;
  }

  const songURL = new URL(rawSongURL);
  songURL.protocol = process.env.GENIUS_PROXY_PROTOCOL || "http";
  songURL.host = process.env.GENIUS_PROXY_HOST!;
  songURL.port = process.env.GENIUS_PROXY_PORT || "80";
  songURL.searchParams.set("token", process.env.GENIUS_PROXY_TOKEN!);

  const htmlResponse = await fetch(songURL.toString());
  if (!htmlResponse.ok) {
    console.error(
      `Failed to fetch HTML content for ${htmlResponse.status} ${htmlResponse.statusText} ${songURL.toString()}`
    );
    console.error(await htmlResponse.text());
    return null;
  }
  const htmlText = await htmlResponse.text();

  // Load the HTML content into cheerio
  const $ = cheerio.load(htmlText);

  // Select the lyrics container divs using the data attribute
  const lyricsContainers = $('div[data-lyrics-container="true"]');

  if (lyricsContainers.length === 0) {
    console.log("Couldn't find the lyrics section. URL:", rawSongURL);
    return null;
  }

  // Extract and combine text content from all matching containers
  let lyrics = "";
  lyricsContainers.each((index, element) => {
    const $container = $(element); // Wrap the current container element with cheerio

    // Find and remove nested divs marked for exclusion within this container
    $container.find('div[data-exclude-from-selection="true"]').remove();

    // Replace <br> tags with newlines within the modified element before getting text
    $container.find("br").replaceWith("\n");
    // Append the text content of the modified container
    lyrics += $container.text();
    // Add a newline between sections if there are multiple containers
    if (index < lyricsContainers.length - 1) {
      lyrics += "\n";
    }
  });

  // Remove section headers like [Verse], [Bridge], etc.
  lyrics = lyrics.replace(/\[.*?\]/g, "");

  // Clean up multiple newlines potentially introduced
  lyrics = lyrics.replace(/\n{2,}/g, "\n");

  // Minimal explicit entity decoding (most handled by .text())
  lyrics = lyrics.replace(/&#x27;/g, "'");

  const cleanedLyrics = lyrics.trim();

  // Store lyrics in KV cache if we successfully got them
  if (cleanedLyrics) {
    try {
      await redis.set(`lyrics/${track.id}`, cleanedLyrics);
      console.log("Cached lyrics for:", track.id);
    } catch (error) {
      console.error("Error writing to KV cache:", error);
    }
  }

  return cleanedLyrics;
}

export async function getSpotifyTrack(
  trackId: string,
  accessToken: string
): Promise<SpotifyTrack> {
  // Try to get track data from KV cache first
  try {
    const cachedTrack = await redis.get(`track/${trackId}`);
    if (cachedTrack) {
      console.log("Cache hit for Spotify track:", trackId);
      return cachedTrack as SpotifyTrack;
    }
  } catch (error) {
    console.error("Error reading track from KV cache:", error);
  }

  // If not in cache, fetch from Spotify API
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Failed to fetch song data");
  }

  const track = (await response.json()) as SpotifyTrack;

  // Store track in KV cache (with 24-hour expiration)
  try {
    await redis.set(`track/${trackId}`, track, { ex: 86400 }); // 24 hours cache
    console.log("Cached Spotify track:", trackId);
  } catch (error) {
    console.error("Error writing track to KV cache:", error);
  }

  return track;
}
