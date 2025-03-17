"use client";

import { Music2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SpotifyTrack } from "@/app/types/spotify";

export function SongList(props: { tracks?: SpotifyTrack[] }) {
  // If tracks are provided, use them, otherwise use mock data
  const displayTracks =
    props.tracks || Array.from({ length: 5 }).map(() => null);

  // Helper function to format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
                <div className="text-sm px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  Easy
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pr-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-white text-zinc-900 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 border-zinc-200 transition-colors"
                >
                  Add / Remove
                </Button>
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
        </Link>
      ))}
    </div>
  );
}
