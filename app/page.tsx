"use client"
import { Music2, Star, Trophy, Archive, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 text-zinc-900 p-4 md:p-6">
      <Tabs defaultValue="your-songs" className="space-y-8">
        <div className="rounded-2xl p-1.5 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
          <TabsList className="grid grid-cols-3 h-auto bg-transparent gap-2">
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
                  <div className="text-xs text-zinc-500 font-normal">Songs that you saved</div>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger
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
                  <div className="text-xs text-zinc-500 font-normal">Most listened on Spotify</div>
                </div>
              </div>
            </TabsTrigger>
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
                  <div className="text-xs text-zinc-500 font-normal">Songs you archived</div>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="your-songs" className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900">Your Songs</h2>
          <div className="space-y-3 rounded-2xl p-4">
            <div className="grid grid-cols-[auto,1fr,120px,120px,120px] gap-4 items-center px-3 text-sm font-medium text-zinc-500">
              <div className="w-12"></div>
              <div className="px-3">Title</div>
              <div className="flex justify-center">Duration</div>
              <div className="flex justify-center">Difficulty</div>
              <div></div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Link href="/song/1" className="block" key={i}>
                <div className="group relative overflow-hidden rounded-xl bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all border border-transparent hover:border-purple-500/20">
                  <div className="grid grid-cols-[auto,1fr,120px,120px,120px] gap-4 items-center p-3">
                    <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Music2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="px-3">
                      <div className="font-medium">눈밤 (Spring Snow)</div>
                      <div className="text-sm text-zinc-500">Lovely Runner</div>
                    </div>
                    <div className="text-sm text-zinc-500 flex justify-center">3:21</div>
                    <div className="flex justify-center">
                      <div className="text-sm px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                        Easy
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pr-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-zinc-900 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 border-zinc-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Add / Remove
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:bg-purple-50 hover:text-purple-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="cursor-pointer">Add to playlist</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top-spotify" className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900">Top Spotify</h2>
          <div className="space-y-3 rounded-2xl p-4">
            <div className="grid grid-cols-[auto,1fr,120px,120px,120px] gap-4 items-center px-3 text-sm font-medium text-zinc-500">
              <div className="w-12"></div>
              <div className="px-3">Title</div>
              <div className="flex justify-center">Duration</div>
              <div className="flex justify-center">Difficulty</div>
              <div></div>
            </div>
            {[
              { title: "마지막 인사 (Last Goodbye)", artist: "Big Bang", duration: "4:15", difficulty: "Medium" },
              { title: "봄날 (Spring Day)", artist: "BTS", duration: "4:36", difficulty: "Hard" },
              { title: "Ditto", artist: "NewJeans", duration: "3:05", difficulty: "Easy" },
              { title: "사건의 지평선", artist: "윤하 (YOUNHA)", duration: "4:45", difficulty: "Medium" },
              { title: "Hype Boy", artist: "NewJeans", duration: "2:59", difficulty: "Easy" },
            ].map((song, i) => (
              <Link href={`/song/${i + 2}`} className="block" key={i}>
                <div className="group relative overflow-hidden rounded-xl bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all border border-transparent hover:border-purple-500/20">
                  <div className="grid grid-cols-[auto,1fr,120px,120px,120px] gap-4 items-center p-3 pr-14">
                    <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Music2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-sm text-zinc-500">{song.artist}</div>
                    </div>
                    <div className="text-sm text-zinc-500 text-center">{song.duration}</div>
                    <div className="flex justify-center">
                      <div
                        className={`text-sm px-2 py-1 rounded-full font-medium ${
                          song.difficulty === "Easy"
                            ? "bg-emerald-100 text-emerald-700"
                            : song.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {song.difficulty}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-zinc-900 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 border-zinc-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Add / Remove
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:bg-purple-50 hover:text-purple-600 absolute right-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="cursor-pointer">Add to playlist</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archives" className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900">Archives</h2>
          <div className="space-y-3 rounded-2xl p-4">
            <div className="grid grid-cols-[auto,1fr,120px,120px,120px] gap-4 items-center px-3 text-sm font-medium text-zinc-500">
              <div className="w-12"></div>
              <div className="px-3">Title</div>
              <div className="flex justify-center">Duration</div>
              <div className="flex justify-center">Difficulty</div>
              <div></div>
            </div>
            {[
              {
                title: "다시 만난 세계 (Into the New World)",
                artist: "Girls' Generation",
                duration: "4:06",
                difficulty: "Medium",
              },
              { title: "Dynamite", artist: "BTS", duration: "3:19", difficulty: "Easy" },
              { title: "눈의 꽃 (Snow Flower)", artist: "Park Hyo Shin", duration: "4:24", difficulty: "Hard" },
              { title: "에필로그 (Epilogue)", artist: "IU", duration: "3:52", difficulty: "Medium" },
              { title: "Butter", artist: "BTS", duration: "2:45", difficulty: "Easy" },
            ].map((song, i) => (
              <Link href={`/song/${i + 7}`} className="block" key={i}>
                <div className="group relative overflow-hidden rounded-xl bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all border border-transparent hover:border-purple-500/20">
                  <div className="grid grid-cols-[auto,1fr,120px,120px,120px] gap-4 items-center p-3 pr-14">
                    <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Music2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-sm text-zinc-500">{song.artist}</div>
                    </div>
                    <div className="text-sm text-zinc-500 text-center">{song.duration}</div>
                    <div className="flex justify-center">
                      <div
                        className={`text-sm px-2 py-1 rounded-full font-medium ${
                          song.difficulty === "Easy"
                            ? "bg-emerald-100 text-emerald-700"
                            : song.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {song.difficulty}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-zinc-900 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 border-zinc-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Add / Remove
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:bg-purple-50 hover:text-purple-600 absolute right-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="cursor-pointer">Add to playlist</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

