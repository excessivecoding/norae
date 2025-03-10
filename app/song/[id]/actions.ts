"use server";

import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images?: { url: string; height: number; width: number }[];
  };
  duration_ms: number;
};

type ToggleFavoriteParams = {
  track: SpotifyTrack;
  email: string;
  operation: "add" | "remove";
};

/**
 * Toggles a song as favorite for a user in Cloudflare KV storage
 */
export async function toggleFavorite({
  track,
  operation,
}: ToggleFavoriteParams) {
  const session = await auth();
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }
  const env = getCloudflareContext().env as Env;

  const rawData = await env.KV.get(`v1/${session.user.email}/favorites`);
  const favorites = JSON.parse(rawData || "[]") as string[];

  if (operation === "add") {
    const data = await env.KV.put(
      `v1/${session.user.email}/favorites`,
      JSON.stringify([...favorites, track.id])
    );
  } else {
    // data.favoriteSongs = data.favoriteSongs?.filter((t) => t.id !== track.id);
  }
}

/**
 * Checks if a song is in the user's favorites
 */
export async function checkIsFavorite(trackId: string, email: string) {
  //   try {
  //     const key = `${email}.favoriteSongs`;
  //     const favorites: SpotifyTrack[] = (await kvGet(key)) || [];
  //     return favorites.some((track) => track.id === trackId);
  //   } catch (error) {
  //     console.error("Error in checkIsFavorite:", error);
  //     return false;
  //   }
  // }
  // /**
  //  * Gets all favorite songs for a user
  //  */
  // export async function getFavoriteSongs(email: string) {
  //   try {
  //     const key = `${email}.favoriteSongs`;
  //     const favorites: SpotifyTrack[] = (await kvGet(key)) || [];
  //     return favorites;
  //   } catch (error) {
  //     console.error("Error in getFavoriteSongs:", error);
  //     return [];
  //   }
}
