"use client";

import { Music2, MoreVertical, Loader, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SpotifyTrack } from "@/app/types/spotify";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  toggleFavorite,
  getUserFavorites,
  getTrackDifficulty,
  TrackDifficulty,
} from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function SongList(props: { tracks?: SpotifyTrack[] }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // If tracks are provided, use them, otherwise use mock data
  const displayTracks =
    props.tracks || Array.from({ length: 5 }).map(() => null);

  // Load favorites using React Query (single request)
  const { data: favoriteIds = new Set<string>() } = useQuery<Set<string>>({
    queryKey: ["favorites", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return new Set<string>();

      const favorites = await getUserFavorites(session.user.email);
      return new Set(favorites.map((track) => track.id));
    },
    enabled: !!session?.user?.email,
  });

  // Create toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({
      track,
      isFavorite,
    }: {
      track: SpotifyTrack;
      isFavorite: boolean;
    }) => {
      if (!session?.user?.email) return;

      return toggleFavorite({
        track,
        email: session.user.email,
        operation: isFavorite ? "remove" : "add",
      });
    },
    onMutate: async ({ track, isFavorite }) => {
      // Optimistically update favorites
      const queryKey = ["favorites", session?.user?.email];
      await queryClient.cancelQueries({ queryKey });

      const previousFavorites = queryClient.getQueryData<Set<string>>(queryKey);
      const newFavorites = new Set(previousFavorites);

      if (isFavorite) {
        newFavorites.delete(track.id);
      } else {
        newFavorites.add(track.id);
      }

      queryClient.setQueryData(queryKey, newFavorites);

      return { previousFavorites };
    },
    onError: (_, __, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          ["favorites", session?.user?.email],
          context.previousFavorites
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites", session?.user?.email],
      });
    },
  });

  // Function to toggle a favorite status
  const handleToggleFavorite = async (track: SpotifyTrack) => {
    const isFavorite = favoriteIds.has(track.id);
    await toggleFavoriteMutation.mutateAsync({ track, isFavorite });
  };

  return (
    <div className="space-y-3 rounded-2xl">
      <div className="grid grid-cols-[auto,1fr,120px,120px,120px] gap-4 items-center px-3 text-sm font-medium text-zinc-500">
        <div className="w-12"></div>
        <div className="px-3">Title</div>
        <div className="flex justify-center">Duration</div>
        <div className="flex justify-center">Difficulty</div>
        <div></div>
      </div>
      {displayTracks.map((track, i) => (
        <Link
          href={track ? `/song/${track.id}` : "/song/1"}
          className="block"
          key={i}
        >
          <SongItem
            track={track}
            isFavorite={track ? favoriteIds.has(track.id) : false}
            onToggleFavorite={handleToggleFavorite}
          />
        </Link>
      ))}
    </div>
  );
}

function SongItem({
  track,
  isFavorite,
  onToggleFavorite,
}: {
  track: SpotifyTrack | null;
  isFavorite: boolean;
  onToggleFavorite: (track: SpotifyTrack) => Promise<void>;
}) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);
  const [loadDifficulty, setLoadDifficulty] = useState(false);

  // Query for track difficulty - now only enabled when loadDifficulty is true
  const {
    data: difficultyData,
    isLoading: isDifficultyLoading,
    refetch,
  } = useQuery({
    queryKey: ["trackDifficulty", track?.id],
    queryFn: async () => {
      if (!track || !session?.user?.email)
        return { difficulty: null } as { difficulty: TrackDifficulty | null };
      return getTrackDifficulty(track);
    },
    enabled: false, // Initially disabled - manual trigger only
  });

  const difficulty = difficultyData?.difficulty;

  // Function to handle difficulty loading
  const handleLoadDifficulty = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setLoadDifficulty(true);
    refetch();
  };

  // Helper function to get difficulty styling
  const getDifficultyStyle = (difficulty: TrackDifficulty | null) => {
    if (!difficulty) return "bg-gray-100 text-gray-700";
    switch (difficulty) {
      case "easy":
        return "bg-emerald-100 text-emerald-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "hard":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper function to format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle favorite toggle
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (!session?.user?.email || !track) {
      toast({
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    setIsToggling(true);
    try {
      await onToggleFavorite(track);

      toast({
        description: !isFavorite
          ? "Added to favorites"
          : "Removed from favorites",
        duration: 2000,
      });
    } catch (error) {
      toast({
        description: "Failed to update favorites",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all border border-transparent hover:border-purple-500/20">
      <div className="grid grid-cols-[auto,1fr,120px,120px,120px] gap-4 items-center p-3">
        <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
          {track?.album?.images && track.album.images.length > 0 ? (
            <img
              src={track.album.images[0].url}
              alt={`${track.album.name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music2 className="w-6 h-6 text-purple-500" />
          )}
        </div>
        <div className="px-3">
          <div className="font-semibold">
            {track ? track.name : "눈밤 (Spring Snow)"}
          </div>
          <div className="text-sm text-zinc-500">
            {track ? track.artists[0]?.name : "Lovely Runner"}
          </div>
        </div>
        <div className="text-sm text-zinc-500 flex justify-center">
          {track ? formatDuration(track.duration_ms) : "3:21"}
        </div>
        <div className="flex justify-center">
          {!loadDifficulty ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadDifficulty}
              className="text-xs px-2 py-1 h-auto"
            >
              Check Difficulty
            </Button>
          ) : (
            <div
              className={`text-sm px-2 py-1 rounded-full font-medium ${getDifficultyStyle(
                difficulty as TrackDifficulty
              )}`}
            >
              {isDifficultyLoading || !difficulty ? (
                <span className="flex items-center gap-1">
                  <Loader className="h-3 w-3 animate-spin" />
                  Analyzing
                </span>
              ) : (
                difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 pr-3">
          {track && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToggleFavorite}
              className={`transition-all duration-300 ${
                isFavorite
                  ? "bg-yellow-50 text-yellow-500 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-yellow-50 hover:text-yellow-500 hover:border-yellow-200"
              }`}
              disabled={isToggling}
            >
              {isToggling ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Star
                  className={`h-4 w-4 transition-all duration-300 ${
                    isFavorite
                      ? "fill-current text-yellow-500"
                      : "text-zinc-600"
                  }`}
                />
              )}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:bg-purple-50 hover:text-purple-600"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="cursor-pointer">
                Add to playlist
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600">
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
