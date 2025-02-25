"use client";

import * as React from "react";
import { Search, Music2, Clock, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Mock data for search suggestions
const recentSearches = [
  "Spring Day - BTS",
  "Dynamite",
  "눈의 꽃 (Snow Flower)",
];

const popularSearches = [
  { title: "Ditto", artist: "NewJeans", searches: "50K searches" },
  { title: "Hype Boy", artist: "NewJeans", searches: "45K searches" },
  { title: "봄날 (Spring Day)", artist: "BTS", searches: "42K searches" },
];

export function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative group flex-1 z-10" ref={searchRef}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity" />
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search songs..."
          className="pl-8 bg-white/80 backdrop-blur-sm border-transparent h-10 text-zinc-900 placeholder:text-zinc-400 w-full ring-offset-purple-500 focus-visible:ring-purple-500/20 transition-all"
          onFocus={() => setIsSearchOpen(true)}
        />
      </div>
      {isSearchOpen && (
        <div className="absolute w-full mt-2 rounded-xl border bg-white/80 backdrop-blur-sm shadow-lg z-50">
          <Command className="rounded-lg border-none bg-transparent">
            <CommandList>
              <CommandGroup heading="Recent Searches" className="px-2">
                {recentSearches.map((search) => (
                  <CommandItem
                    key={search}
                    className="flex items-center gap-2 px-2 rounded-lg hover:bg-purple-50 aria-selected:bg-purple-50"
                  >
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span>{search}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Popular Now" className="px-2">
                {popularSearches.map((item) => (
                  <CommandItem
                    key={item.title}
                    className="flex items-center gap-2 px-2 rounded-lg hover:bg-purple-50 aria-selected:bg-purple-50"
                  >
                    <div className="flex-1 flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                        <Music2 className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-zinc-500">
                          {item.artist}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span>{item.searches}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandEmpty className="py-6 text-center text-sm">
                No results found.
              </CommandEmpty>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
