"use client";

import * as React from "react";
import { Search, Music2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useDebounce } from "../hooks/use-debounce";
import { useRouter } from "next/navigation";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album?: {
    name: string;
    images?: { url: string }[];
  };
  popularity: number;
}

interface SpotifyResponse {
  tracks?: {
    items: SpotifyTrack[];
  };
}

// Mock data for search suggestions
// const recentSearches = [
//   "Spring Day - BTS",
//   "Dynamite",
//   "눈의 꽃 (Snow Flower)",
// ];

// const popularSearches = [
//   { title: "Ditto", artist: "NewJeans", searches: "50K searches" },
//   { title: "Hype Boy", artist: "NewJeans", searches: "45K searches" },
//   { title: "봄날 (Spring Day)", artist: "BTS", searches: "42K searches" },
// ];

export function SearchBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = React.useState("");
  const debouncedSearch = useDebounce(searchInput, 1000);

  const {
    data: tracks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["spotifyTrackSearch", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch.trim() || !session?.accessToken) {
        return [] as SpotifyTrack[];
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          debouncedSearch
        )}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const data = (await response.json()) as SpotifyResponse;

      // Process and return tracks
      return (
        data.tracks?.items.sort(
          (a, b) => (b.popularity || 0) - (a.popularity || 0)
        ) || []
      );
    },
    enabled: !!debouncedSearch && !!session?.accessToken,
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open search dropdown when there are results or when input is focused
  React.useEffect(() => {
    if (tracks.length > 0 && debouncedSearch) {
      setIsSearchOpen(true);
    }
  }, [tracks, debouncedSearch]);

  const handleTrackClick = (trackId: string) => {
    setIsSearchOpen(false);
    router.push(`/song/${trackId}`);
  };

  return (
    <div className="relative group flex-1 z-10" ref={searchRef}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity" />
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search songs..."
          className="pl-8 bg-white/80 backdrop-blur-sm border-transparent h-10 text-zinc-900 placeholder:text-zinc-400 w-full ring-offset-purple-500 focus-visible:ring-purple-500/20 transition-all"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
        />
      </div>
      {isSearchOpen && (
        <div className="absolute w-full mt-2 rounded-xl border bg-white/80 backdrop-blur-sm shadow-lg z-50">
          <Command className="rounded-lg border-none bg-transparent">
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-zinc-500">
                  Searching...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-sm text-red-500">
                  {(error as Error).message || "Failed to search Spotify"}
                </div>
              ) : (
                <CommandGroup heading="Results" className="px-2">
                  {tracks.map((track) => (
                    <CommandItem
                      key={track.id}
                      className="flex items-center gap-2 px-2 rounded-lg hover:bg-purple-50 aria-selected:bg-purple-50 cursor-pointer"
                      onSelect={() => handleTrackClick(track.id)}
                    >
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                          <Music2 className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{track.name}</span>
                          <span className="text-xs text-zinc-500">
                            {track.artists.map((a) => a.name).join(", ")}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandEmpty className="py-6 text-center text-sm">
                No tracks found.
              </CommandEmpty>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
