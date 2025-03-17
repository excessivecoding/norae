import { auth } from "@/auth";
import { LyricsSection, SongPageContent } from "./content";
import { hasUserFavorite } from "../../actions";
import { SpotifyTrack } from "@/app/types/spotify";
import { redis } from "@/app/redis";
import { Suspense } from "react";

export default async function SongPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.accessToken || !session?.user?.email) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${params.id}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch song data");
  }

  const data = (await response.json()) as SpotifyTrack;

  const isFavorite = await hasUserFavorite(session.user.email, params.id);

  return (
    <SongPageContent data={data} isFavorite={isFavorite}>
      <Suspense fallback={<div>Loading...</div>}>
        <Lyrics data={data} />
      </Suspense>
    </SongPageContent>
  );
}

async function Lyrics(props: { data: SpotifyTrack }) {
  const lyrics = ((await getLyrics(props.data)) || "").split("\n");
  return <LyricsSection lyrics={lyrics} songId={props.data.id} />;
}

async function getLyrics(track: SpotifyTrack) {
  // Try to get lyrics from KV cache first
  try {
    const cachedLyrics = await redis.get(`lyrics/${track.id}`);
    if (cachedLyrics) {
      console.log("Cache hit for lyrics:", track.id);
      return cachedLyrics;
    }
  } catch (error) {
    console.error("Error reading from KV cache:", error);
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
    return null;
  }

  // Get the song URL from the API result
  const songUrl = firstHit.url;

  if (!songUrl) {
    return null;
  }

  // Fetch the HTML content of the Genius page
  const htmlResponse = await fetch(songUrl);
  const htmlText = await htmlResponse.text();

  // Extract lyrics using a simpler approach to find the lyrics container
  const lyricsRegex =
    /<div[^>]*data-lyrics-container="true"[^>]*>([\s\S]*?)<\/div>/gi;
  const lyricsMatches = [...htmlText.matchAll(lyricsRegex)];

  if (!lyricsMatches || lyricsMatches.length === 0) {
    console.log("Couldn't find the lyrics section.");
    return null;
  }

  // Combine all matches and replace <br> tags with newlines
  let lyrics = lyricsMatches.map((match) => match[1]).join("\n");
  lyrics = lyrics.replace(/<br\s*\/?>/gi, "\n");

  // Remove HTML tags
  lyrics = lyrics.replace(/<[^>]*>/g, "");

  // Remove section headers like [Verse], [Bridge], etc.
  lyrics = lyrics.replace(/\[.*?\]/g, "");

  // Clean up multiple newlines
  lyrics = lyrics.replace(/\n{2,}/g, "\n");

  // Decode HTML entities
  lyrics = lyrics
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'");

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
