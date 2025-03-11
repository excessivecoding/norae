"use server";

import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SpotifyTrack } from "@/app/types/spotify";

export async function getUserFavorites(email: string) {
  const env = getCloudflareContext().env as Env;
  const rawData = await env.KV.get(`v1/${email}/favorites`);
  return JSON.parse(rawData || "[]") as SpotifyTrack[];
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

  const env = getCloudflareContext().env as Env;

  const favorites = await getUserFavorites(session.user.email);

  const data = await env.KV.put(
    `v1/${session.user.email}/favorites`,
    JSON.stringify([...favorites, track])
  );

  return { status: "success" };
}

export async function removeFavorite(track: SpotifyTrack) {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const env = getCloudflareContext().env as Env;

  const favorites = await getUserFavorites(session.user.email);

  const data = await env.KV.put(
    `v1/${session.user.email}/favorites`,
    JSON.stringify(
      favorites.filter((favoriteTrack) => favoriteTrack.id !== track.id)
    )
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
