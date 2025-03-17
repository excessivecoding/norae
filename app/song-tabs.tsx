"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Music2, Star, Trophy, Archive, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// // Define types for the data we receive from Spotify
// interface SpotifyTrack {
//   id: string;
//   name: string;
//   artists: { name: string }[];
//   duration_ms: number;
//   album?: {
//     name: string;
//     images?: { url: string }[];
//   };
// }

// interface SpotifyTopTracks {
//   items: SpotifyTrack[];
// }

// Define types for props
interface SongTabsProps {
  tab: string;
}

export function SongTabs({ tab }: SongTabsProps) {
  const router = useRouter();

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    router.push(`/?tab=${value}`);
  };

  // Add keyboard shortcuts for tabs
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if no input elements are focused
      if (
        !(
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        )
      ) {
        switch (event.key) {
          case "1":
            handleTabChange("your-songs");
            break;
          case "2":
            handleTabChange("your-top");
            break;
          /* Archives feature temporarily disabled
          case "3":
            handleTabChange("archives");
            break;
          */
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  // // You can use topTracks data in your component
  // const hasTopTracks = topTracks?.items && topTracks.items.length > 0;

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="space-y-8">
      <div className="rounded-2xl p-1.5 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <TabsList className="grid grid-cols-2 h-auto bg-transparent gap-2">
          <TabsTrigger
            value="your-songs"
            className="group relative overflow-hidden rounded-xl data-[state=active]:bg-white data-[state=active]:text-zinc-900 py-6 shadow-none border border-transparent data-[state=active]:border-purple-500/20 transition-all hover:bg-white/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 p-2 text-white shadow-lg">
                <Star className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start text-left">
                <div className="font-semibold">Your Songs</div>
                <div className="text-xs text-zinc-500 font-normal">
                  Songs that you saved
                </div>
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="your-top"
            className="group relative overflow-hidden rounded-xl data-[state=active]:bg-white data-[state=active]:text-zinc-900 py-6 shadow-none border border-transparent data-[state=active]:border-purple-500/20 transition-all hover:bg-white/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 p-2 text-white shadow-lg">
                <Music2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start text-left">
                <div className="font-semibold">Your Top</div>
                <div className="text-xs text-zinc-500 font-normal">
                  Your most played songs
                </div>
              </div>
            </div>
          </TabsTrigger>
          {/* <TabsTrigger
            value="top-spotify"
            className="group relative overflow-hidden rounded-xl data-[state=active]:bg-white data-[state=active]:text-zinc-900 py-6 shadow-none border border-transparent data-[state=active]:border-purple-500/20 transition-all hover:bg-white/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 p-2 text-white shadow-lg">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start text-left">
                <div className="font-semibold">Top Spotify</div>
                <div className="text-xs text-zinc-500 font-normal">
                  Most listened on Spotify
                </div>
              </div>
            </div>
          </TabsTrigger> */}
          {/* Archive tab - we might use this feature later
          <TabsTrigger
            value="archives"
            className="group relative overflow-hidden rounded-xl data-[state=active]:bg-white data-[state=active]:text-zinc-900 py-6 shadow-none border border-transparent data-[state=active]:border-purple-500/20 transition-all hover:bg-white/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 p-2 text-white shadow-lg">
                <Archive className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start text-left">
                <div className="font-semibold">Archives</div>
                <div className="text-xs text-zinc-500 font-normal">
                  Songs you archived
                </div>
              </div>
            </div>
          </TabsTrigger>
          */}
        </TabsList>
      </div>

      {/* <TabsContent value="your-songs" className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900">Your Songs</h2>
        <SongList />
      </TabsContent>

      <TabsContent value="your-top" className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900">Your Top</h2>
        <SongList />
      </TabsContent>

      <TabsContent value="top-spotify" className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900">Top Spotify</h2>
        {hasTopTracks ? <SongList tracks={topTracks.items} /> : <SongList />}
      </TabsContent>

      <TabsContent value="archives" className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900">Archives</h2>
        <SongList />
      </TabsContent> */}
    </Tabs>
  );
}
