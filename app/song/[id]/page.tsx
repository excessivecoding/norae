"use client";

import {
  Star,
  Music2,
  Bot,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  X,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const runtime = "edge";

const lyrics = [
  {
    korean: "[Verse 1]",
    english: "[Verse 1]",
  },
  {
    korean: "가려진 오랜 시간이",
    english: "The hidden long time",
  },
  {
    korean: "우리를 다시 불러와",
    english: "Calls us back again",
  },
  {
    korean: "어느 곳에 있어도",
    english: "No matter where we are",
  },
  {
    korean: "그 끝은 항상 너인걸",
    english: "The end is always you",
  },
  {
    korean: "[Chorus]",
    english: "[Chorus]",
  },
  {
    korean: "'Cause I'm falling slowly love with you",
    english: "'Cause I'm falling slowly love with you",
  },
  {
    korean: "오랫동안 기다려온",
    english: "I've been waiting for so long",
  },
  {
    korean: "너는 봄이야",
    english: "You are spring",
  },
  {
    korean: "'Cause I'm falling slowly love with you",
    english: "'Cause I'm falling slowly love with you",
  },
  {
    korean: "다시 지워진다 해도",
    english: "Even if it gets erased again",
  },
  {
    korean: "All my life is you",
    english: "All my life is you",
  },
  {
    korean: "[Bridge]",
    english: "[Bridge]",
  },
  {
    korean: "꽃잎 날리던 하얀 길위에",
    english: "On the white path where petals were flying",
  },
  {
    korean: "행복했던 너와 나",
    english: "You and I who were happy",
  },
  {
    korean: "다시 만날 수 있다면",
    english: "If we could meet again",
  },
  {
    korean: "[Chorus]",
    english: "[Chorus]",
  },
  {
    korean: "'Cause I'm falling slowly love with you",
    english: "'Cause I'm falling slowly love with you",
  },
  {
    korean: "오랫동안 기다려온",
    english: "I've been waiting for so long",
  },
  {
    korean: "너는 봄이야",
    english: "You are spring",
  },
  {
    korean: "'Cause I'm falling slowly love with you",
    english: "'Cause I'm falling slowly love with you",
  },
  {
    korean: "다시 지워진다 해도",
    english: "Even if it gets erased again",
  },
  {
    korean: "All my life is you",
    english: "All my life is you",
  },
  {
    korean: "[Verse 2]",
    english: "[Verse 2]",
  },
  {
    korean: "너라는 이야기 속에",
    english: "In the story called you",
  },
  {
    korean: "다시 또 꿈을 꾸는 나",
    english: "I'm dreaming again",
  },
  {
    korean: "어떤 순간이 와도",
    english: "No matter what moment comes",
  },
  {
    korean: "난 너를 찾아 갈거야",
    english: "I will go find you",
  },
  {
    korean: "[Chorus]",
    english: "[Chorus]",
  },
  {
    korean: "'Cause I'm falling slowly love with you",
    english: "'Cause I'm falling slowly love with you",
  },
  {
    korean: "오랫동안 기다려온",
    english: "I've been waiting for so long",
  },
  {
    korean: "너는 봄이야",
    english: "You are spring",
  },
  {
    korean: "'Cause I'm falling slowly love with you",
    english: "'Cause I'm falling slowly love with you",
  },
  {
    korean: "다시 지워진다 해도",
    english: "Even if it gets erased again",
  },
  {
    korean: "All my life is you",
    english: "All my life is you",
  },
];

export default function SongPage() {
  const [selectedLine, setSelectedLine] = useState<number>(0);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const selectedLineRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("main-header");
      if (header) {
        const rect = header.getBoundingClientRect();
        setIsHeaderVisible(rect.bottom > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedLine((prev) => Math.max(0, prev - 1));
        setSelectedWord(null);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedLine((prev) => Math.min(lyrics.length - 1, prev + 1));
        setSelectedWord(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const words = lyrics[selectedLine].korean.split(" ");
        setSelectedWord((prev) => {
          if (prev === null) return words.length - 1;
          return Math.max(0, prev - 1);
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const words = lyrics[selectedLine].korean.split(" ");
        setSelectedWord((prev) => {
          if (prev === null) return 0;
          return Math.min(words.length - 1, prev + 1);
        });
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedWord(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLine]);

  useEffect(() => {
    if (selectedLineRef.current) {
      selectedLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedLine]);

  const handleStar = () => {
    setIsStarred(!isStarred);
    toast({
      description: !isStarred ? "Added to favorites" : "Removed from favorites",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen text-zinc-900 p-4 md:p-6">
      {!isHeaderVisible && (
        <div className="fixed top-0 left-0 right-0 z-50 p-2 md:p-3 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Music2 className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium">봄눈 (Spring Snow)</div>
                <div className="text-sm text-zinc-500">Yiruma</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStar}
              className={`h-8 w-8 rounded-lg transition-all duration-300 ${
                isStarred
                  ? "bg-yellow-50 text-yellow-500 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-600 hover:border-yellow-300"
                  : "hover:bg-yellow-50 hover:text-yellow-500 hover:border-yellow-200"
              }`}
            >
              <Star
                className={`w-4 h-4 transition-all duration-300 ${
                  isStarred ? "fill-current" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto space-y-6 pb-32">
        <div
          id="main-header"
          className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-4"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music2 className="w-10 h-10 text-purple-500" />
              </div>
            </div>
            <div className="flex flex-col justify-between py-1">
              <div className="mb-3">
                <h1 className="text-2xl font-bold">봄눈 (Spring Snow)</h1>
                <p className="text-zinc-500 mt-1">Yiruma</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleStar}
                  className={`rounded-xl transition-all duration-300 ${
                    isStarred
                      ? "bg-yellow-50 text-yellow-500 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-600 hover:border-yellow-300"
                      : "hover:bg-yellow-50 hover:text-yellow-500 hover:border-yellow-200"
                  }`}
                >
                  <Star
                    className={`w-4 h-4 transition-all duration-300 ${
                      isStarred ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-sm text-zinc-500">
                  <span className="font-medium">3:45</span> • First Love
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none backdrop-blur-sm shadow-none">
            <CardContent className="p-8">
              <div className="space-y-4">
                {lyrics.map((line, index) => (
                  <button
                    key={index}
                    ref={selectedLine === index ? selectedLineRef : null}
                    onClick={() => {
                      setSelectedLine(index);
                      setSelectedWord(null);
                    }}
                    className={`w-full text-left transition-colors ${
                      selectedLine === index
                        ? "text-zinc-900"
                        : "text-zinc-400 hover:text-zinc-600"
                    }`}
                  >
                    <p className="text-2xl leading-relaxed font-bold">
                      {line.korean}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="md:sticky md:top-6 md:self-start">
            <Card className="border-none bg-white/80 backdrop-blur-sm shadow-none mt-6">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="text-3xl font-semibold flex items-center justify-between">
                    <div className="flex flex-wrap gap-1 items-baseline">
                      {lyrics[selectedLine].korean
                        .split(" ")
                        .map((word, index, array) => (
                          <>
                            <button
                              key={index}
                              onClick={() => setSelectedWord(index)}
                              className={`transition-colors relative hover:text-yellow-700/70 ${
                                selectedWord === index
                                  ? "text-yellow-700 font-semibold"
                                  : ""
                              }`}
                            >
                              {selectedWord === index && (
                                <span className="absolute inset-0 bg-yellow-200/70 -skew-y-2 rounded" />
                              )}
                              <span className="relative">{word}</span>
                            </button>
                            {index < array.length - 1 && (
                              <span className="h-1 text-zinc-300 text-sm border-b-2 border-x-2 w-4 border-purple-200" />
                            )}
                          </>
                        ))}
                    </div>
                    {selectedWord !== null && (
                      <button
                        onClick={() => setSelectedWord(null)}
                        className="p-1.5 hover:bg-purple-50 rounded-lg ml-2 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-purple-500"
                      >
                        <span>Unselect</span>
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="min-h-[100px] flex items-center justify-center rounded-lg bg-purple-50/50 p-6">
                    <div className="text-lg text-zinc-700">
                      {lyrics[selectedLine].english}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setIsChatOpen(true)}
                    >
                      <Bot className="w-4 h-4" />
                      Ask GPT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/80 backdrop-blur-sm shadow-none mt-4">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-zinc-900 mb-3">
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-sm text-zinc-500">
                  <div className="flex items-center justify-between">
                    <span>Navigate lines</span>
                    <div className="flex gap-1">
                      <kbd className="px-2 py-1 bg-zinc-100 rounded text-zinc-600">
                        ↑
                      </kbd>
                      <kbd className="px-2 py-1 bg-zinc-100 rounded text-zinc-600">
                        ↓
                      </kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Navigate words</span>
                    <div className="flex gap-1">
                      <kbd className="px-2 py-1 bg-zinc-100 rounded text-zinc-600">
                        ←
                      </kbd>
                      <kbd className="px-2 py-1 bg-zinc-100 rounded text-zinc-600">
                        →
                      </kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Clear selection</span>
                    <kbd className="px-2 py-1 bg-zinc-100 rounded text-zinc-600">
                      Esc
                    </kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent
          side="left"
          className={cn(
            "!w-[50%] !max-w-none p-0",
            "data-[state=open]:duration-500 data-[state=closed]:duration-300",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          )}
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>Chat with GPT</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Chat messages will go here */}
            </div>
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle message submission
                  setMessage("");
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="fixed bottom-14 left-0 right-0 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="w-1/2 md:ml-auto">
            <Card className="border-none bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-0">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/track/0tCr7DoUBSdtdSl0rxZmct?utm_source=generator"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
