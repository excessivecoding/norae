"use client"

import { Star, Share2, Music2, Bot, Play, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

const lyrics = [
  {
    korean: "가려진 오랜 시간이",
    english: "The long time that has been hidden",
  },
  {
    korean: "드디어 빛을 보네요",
    english: "Finally sees the light",
  },
  {
    korean: "기다림의 끝자락에",
    english: "At the end of waiting",
  },
  {
    korean: "서서히 다가오죠",
    english: "It's slowly approaching",
  },
  {
    korean: "잊혀진 줄 알았던",
    english: "The heart that I thought was forgotten",
  },
  {
    korean: "그 마음이 깨어나",
    english: "Wakes up",
  },
  {
    korean: "다시 한 번 시작해요",
    english: "Let's start again",
  },
  {
    korean: "우리 함께라면",
    english: "If we're together",
  },
]

export default function SongPage() {
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [isStarred, setIsStarred] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 text-zinc-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music2 className="w-12 h-12 text-purple-500" />
              </div>
            </div>
            <div className="flex flex-col justify-between py-2">
              <div>
                <h1 className="text-2xl font-bold">가려진 오랜 시간이</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsStarred(!isStarred)}
                  className={`rounded-xl transition-all duration-300 ${
                    isStarred
                      ? "bg-yellow-50 text-yellow-500 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-600 hover:border-yellow-300"
                      : "hover:bg-yellow-50 hover:text-yellow-500 hover:border-yellow-200"
                  }`}
                >
                  <Star className={`w-4 h-4 transition-all duration-300 ${isStarred ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-sm text-zinc-500">
                  <span className="font-medium">3:45</span> • Pop
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none bg-white/80 backdrop-blur-sm shadow-none">
            <CardContent className="p-8">
              <div className="space-y-1">
                {lyrics.map((line, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLine(index)}
                    className={`w-full text-left transition-colors ${
                      selectedLine === index
                        ? "text-purple-600 font-semibold"
                        : "text-zinc-600 hover:text-purple-600/75"
                    }`}
                  >
                    <p className="text-xl">{line.korean}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none bg-white/80 backdrop-blur-sm shadow-none">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Translation</h2>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Bot className="w-4 h-4" />
                      Ask GPT
                    </Button>
                  </div>
                  <div className="min-h-[100px] flex items-center justify-center rounded-lg bg-purple-50/50 p-6">
                    {selectedLine !== null ? (
                      <p className="text-xl text-purple-900">{lyrics[selectedLine].english}</p>
                    ) : (
                      <p className="text-zinc-500">Select a line to see translation</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/80 backdrop-blur-sm shadow-none">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Now Playing</div>
                      <div className="text-xs text-zinc-500">0:00 / 3:45</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-purple-50 hover:text-purple-600"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Slider defaultValue={[100]} max={100} step={1} className="w-[60px]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Slider defaultValue={[33]} max={100} step={1} />
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-purple-50 hover:text-purple-600"
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button size="icon" className="rounded-xl bg-purple-500 hover:bg-purple-600 text-white w-12 h-12">
                        <Play className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-purple-50 hover:text-purple-600"
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

