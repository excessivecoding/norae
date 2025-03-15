"use server";

import { auth } from "@/auth";
import { SpotifyTrack } from "@/app/types/spotify";
import { redis } from "./redis";

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
