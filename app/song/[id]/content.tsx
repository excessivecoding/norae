"use client";

import { Star, Music2, Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "../../actions";
import { SpotifyTrack } from "@/app/types/spotify";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TranslationResult } from "@/app/translation";
import { Textarea } from "@/components/ui/textarea";

// Helper function to format duration from milliseconds to MM:SS
const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

interface InteractiveLyricsProps {
  line: string;
  initialSelectedWord?: number | null;
  onWordSelect?: (index: number | null) => void;
  songId: string; // Add songId prop to fetch translations
}

const InteractiveLyrics: React.FC<InteractiveLyricsProps> = ({
  line,
  initialSelectedWord = null,
  onWordSelect,
  songId,
}) => {
  const [selectedWord, setSelectedWord] = useState<number | null>(
    initialSelectedWord
  );

  // Reset selected word when line changes
  useEffect(() => {
    setSelectedWord(null);
  }, [line]);

  // Move translation query logic here
  const { data: translationData, isLoading: isTranslationLoading } =
    useQuery<TranslationResult>({
      queryKey: ["translation", songId, line],
      queryFn: async (): Promise<TranslationResult> => {
        const response = await fetch("/api/translations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            songId: songId,
            text: line,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch translation");
        }

        return await response.json();
      },
      enabled: !!line.trim(), // Only run query if there's a line to translate
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
      retry: 1, // Retry once on failure
    });

  // Extract the breakdown and translation for display
  const breakdown = translationData ? translationData.breakdown : [];

  const translation = translationData ? translationData.translation : null;

  // Handle selecting a breakdown element
  const handleWordSelect = (index: number) => {
    const newSelectedWord = selectedWord === index ? null : index;
    setSelectedWord(newSelectedWord);
    if (onWordSelect) onWordSelect(newSelectedWord);
  };

  // Handle unselecting a word
  const handleUnselect = () => {
    setSelectedWord(null);
    if (onWordSelect) onWordSelect(null);
  };

  // Add keyboard navigation inside the component
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        // Find the previous non-space element
        if (breakdown.length > 0) {
          setSelectedWord((prev) => {
            if (prev === null) return findFirstNonSpaceIndex(breakdown);

            // Move backwards and skip spaces
            let newIndex = prev - 1;
            while (newIndex >= 0 && breakdown[newIndex].text === " ") {
              newIndex--;
            }
            return Math.max(0, newIndex);
          });
        } else {
          event.preventDefault();
          setSelectedWord((prev) =>
            prev === null ? 0 : Math.max(0, prev - 1)
          );
        }
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        // Find the next non-space element
        if (breakdown.length > 0) {
          setSelectedWord((prev) => {
            if (prev === null) return findFirstNonSpaceIndex(breakdown);

            // Move forwards and skip spaces
            let newIndex = prev + 1;
            while (
              newIndex < breakdown.length &&
              breakdown[newIndex].text === " "
            ) {
              newIndex++;
            }
            return newIndex < breakdown.length ? newIndex : prev;
          });
        } else {
          event.preventDefault();
          const elementsCount = line.split(" ").length;
          setSelectedWord((prev) =>
            prev === null ? 0 : Math.min(elementsCount - 1, prev + 1)
          );
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        handleUnselect();
      }
    };

    // Helper function to find the first non-space element
    const findFirstNonSpaceIndex = (elements: any[]) => {
      const index = elements.findIndex((element) => element.text !== " ");
      return index >= 0 ? index : 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [line, breakdown]); // Re-add event listener when line or breakdown changes

  // Get current selected element details
  const selectedElement =
    selectedWord !== null ? breakdown[selectedWord] : null;

  return (
    <div className="space-y-4">
      <div className="text-3xl font-semibold">
        <div className="flex flex-wrap gap-1 items-baseline justify-between w-full">
          <div className="flex flex-wrap gap-1 items-baseline">
            {breakdown.length > 0
              ? // Use breakdown data when available
                breakdown.map((element, index) => {
                  if (element.text === " ") {
                    return (
                      <span
                        key={index}
                        className="h-1 text-zinc-300 text-sm border-b-2 border-x-2 w-4 border-purple-200"
                      />
                    );
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleWordSelect(index)}
                      type="button"
                      className={`transition-colors relative hover:text-yellow-700/70 ${
                        selectedWord === index
                          ? "text-yellow-700 font-semibold"
                          : ""
                      }`}
                    >
                      {selectedWord === index && (
                        <span className="absolute inset-0 bg-yellow-200/70 -skew-y-2 rounded" />
                      )}
                      <span className="relative">{element.text}</span>
                    </button>
                  );
                })
              : // Fallback to splitting the line
                line
                  .split(" ")
                  .map((word: string, index: number, array: string[]) => (
                    <React.Fragment key={index}>
                      <button
                        onClick={() => handleWordSelect(index)}
                        type="button"
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
                    </React.Fragment>
                  ))}
          </div>

          {selectedWord !== null && (
            <button
              onClick={handleUnselect}
              className="p-1.5 hover:bg-purple-50 rounded-lg ml-2 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-purple-500"
            >
              <span>Unselect</span>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Translation display section */}
      <div className="min-h-[100px] flex items-center justify-center rounded-lg bg-purple-50/50 p-6">
        {isTranslationLoading ? (
          <div className="text-lg text-zinc-500 italic">Translating...</div>
        ) : selectedElement ? (
          // Show selected element details when available
          <div className="flex flex-col gap-2 w-full">
            <div className="text-lg text-zinc-700 font-semibold">
              {selectedElement.translation || translation}
            </div>
            {selectedElement.explanation && (
              <div className="text-sm text-zinc-600">
                {selectedElement.explanation}
              </div>
            )}
            {selectedElement.infinitive && (
              <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-700">Root Form:</div>
                <div className="flex justify-between">
                  <div>{selectedElement.infinitive.text}</div>
                  <div>{selectedElement.infinitive.translation}</div>
                </div>
              </div>
            )}
          </div>
        ) : translation ? (
          // Show full translation when no element is selected
          <div className="text-lg text-zinc-700">{translation}</div>
        ) : (
          <div className="text-lg text-zinc-700">{line}</div>
        )}
      </div>
    </div>
  );
};

export function SongPageContent(props: {
  data: SpotifyTrack;
  isFavorite: boolean;
  lyrics: string[];
}) {
  const [selectedLine, setSelectedLine] = useState<number>(0);
  const [isStarred, setIsStarred] = useState(props.isFavorite);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isQuestionInputVisible, setIsQuestionInputVisible] = useState(false);
  const { toast } = useToast();
  const selectedLineRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // load lyrics translation - moved to InteractiveLyrics component
  const currentLine = props.lyrics[selectedLine] || "";

  // Prefetch the translations for the next 2 lines when the selected line changes
  useEffect(() => {
    // Helper function to prefetch translations
    const prefetchLineTranslation = async (lineIndex: number) => {
      const lineText = props.lyrics[lineIndex];

      // Only prefetch if the line exists and has content
      if (lineText && lineText.trim()) {
        try {
          // Using the prefetchQuery method as described in TanStack Query docs
          await queryClient.prefetchQuery({
            queryKey: ["translation", props.data.id, lineText],
            queryFn: async () => {
              const response = await fetch("/api/translations", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  songId: props.data.id,
                  text: lineText,
                }),
              });

              if (!response.ok) {
                throw new Error("Failed to fetch translation");
              }

              return await response.json();
            },
            staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
            gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
          });

          console.log(`Prefetched translation for line ${lineIndex}`);
        } catch (error) {
          console.error(
            `Error prefetching translation for line ${lineIndex}:`,
            error
          );
          // Don't throw - we don't want to break the UI for prefetch failures
        }
      }
    };

    // Prefetch next two lines
    const nextLineIndex = selectedLine + 1;
    const nextNextLineIndex = selectedLine + 2;

    // Use Promise.all to fetch both in parallel
    Promise.all([
      prefetchLineTranslation(nextLineIndex),
      prefetchLineTranslation(nextNextLineIndex),
    ]).catch((error) => {
      console.error("Error during prefetching:", error);
    });
  }, [selectedLine, props.data.id, props.lyrics, queryClient]);

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
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedLine((prev) => Math.min(props.lyrics.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props.lyrics.length]);

  useEffect(() => {
    if (selectedLineRef.current) {
      selectedLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedLine]);

  // Use this effect to focus the textarea when it becomes visible
  useEffect(() => {
    if (isQuestionInputVisible && questionInputRef.current) {
      questionInputRef.current.focus();
    }
  }, [isQuestionInputVisible]);

  const handleStar = async () => {
    try {
      const newStatus = !isStarred;
      setIsStarred(newStatus);

      // Get user email from session or context
      const response = await fetch("/api/auth/session");
      const sessionData = await response.json();

      // Type guard for the sessionData
      if (
        !sessionData ||
        typeof sessionData !== "object" ||
        !("user" in sessionData) ||
        !sessionData.user ||
        typeof sessionData.user !== "object" ||
        !("email" in sessionData.user)
      ) {
        throw new Error("User not authenticated");
      }

      const userEmail = sessionData.user.email as string;

      await toggleFavorite({
        track: props.data,
        email: userEmail,
        operation: newStatus ? "add" : "remove",
      });

      toast({
        description: newStatus
          ? "Added to favorites"
          : "Removed from favorites",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsStarred(!isStarred); // Revert on error
      toast({
        description: "Failed to update favorites",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSubmitQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use FormData to get the question value
    const formData = new FormData(e.currentTarget);
    const questionValue = formData.get("question") as string;

    // Only proceed if there's an actual question
    if (!questionValue?.trim()) {
      toast({
        description: "Please enter a question",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    // Create a context-rich prompt that includes information about the song
    const enrichedPrompt = `Help me understand this song: "${props.data.name}" by ${props.data.artists[0].name}. 
Current lyric line: "${props.lyrics[selectedLine]}". 
My question: ${questionValue}`;

    // Encode the prompt for use in a URL
    const encodedPrompt = encodeURIComponent(enrichedPrompt);

    // Construct the ChatGPT URL with the gpt-4 model and the encoded prompt
    const chatGptUrl = `https://chat.openai.com/?model=gpt-4&q=${encodedPrompt}`;

    // Show a notification
    toast({
      description: "Opening ChatGPT with your question",
      duration: 2000,
    });

    // Reset the form
    if (formRef.current) {
      formRef.current.reset();
    }

    // Hide the question input
    setIsQuestionInputVisible(false);

    // Open ChatGPT in a new tab
    window.open(chatGptUrl, "_blank");
  };

  return (
    <div className="min-h-screen text-zinc-900 p-4 md:p-6">
      {!isHeaderVisible && (
        <div className="fixed top-0 left-0 right-0 z-50 p-2 md:p-3 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center overflow-hidden">
                {props.data.album?.images &&
                props.data.album.images.length > 0 ? (
                  <img
                    src={props.data.album.images[0].url}
                    alt={`${props.data.album.name} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music2 className="w-4 h-4 text-purple-500" />
                )}
              </div>
              <div>
                <div className="font-medium">{props.data.name}</div>
                <div className="text-sm text-zinc-500">
                  {props.data.artists[0].name}
                </div>
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
            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
              {props.data.album?.images &&
              props.data.album.images.length > 0 ? (
                <img
                  src={props.data.album.images[0].url}
                  alt={`${props.data.album.name} cover`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music2 className="w-10 h-10 text-purple-500" />
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col justify-between py-1">
              <div className="mb-3">
                <h1 className="text-2xl font-bold">{props.data.name}</h1>
                <p className="text-zinc-500 mt-1">
                  {props.data.artists[0].name}
                </p>
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
                  <span className="font-medium">
                    {formatDuration(props.data.duration_ms)}
                  </span>{" "}
                  • {props.data.album?.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none backdrop-blur-sm shadow-none">
            <CardContent className="p-8">
              <div className="space-y-4">
                {props.lyrics.map((line, index) => (
                  <button
                    key={index}
                    ref={selectedLine === index ? selectedLineRef : null}
                    onClick={() => setSelectedLine(index)}
                    className={`w-full text-left transition-colors ${
                      selectedLine === index
                        ? "text-zinc-900"
                        : "text-zinc-400 hover:text-zinc-600"
                    }`}
                  >
                    <p className="text-2xl leading-relaxed font-bold">{line}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="md:sticky md:top-6 md:self-start">
            <Card className="border-none bg-white/80 backdrop-blur-sm shadow-none mt-6">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <InteractiveLyrics
                    line={props.lyrics[selectedLine] || ""}
                    songId={props.data.id}
                  />
                  <div className="flex justify-end">
                    {!isQuestionInputVisible ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsQuestionInputVisible(true)}
                      >
                        <Bot className="w-4 h-4" />
                        Ask GPT
                      </Button>
                    ) : (
                      <div className="w-full space-y-3">
                        <form
                          ref={formRef}
                          onSubmit={handleSubmitQuestion}
                          className="space-y-3"
                        >
                          <Textarea
                            ref={questionInputRef}
                            name="question"
                            placeholder="Ask any question about the lyrics, meaning, translation, or cultural context of this song..."
                            className="w-full min-h-[100px] resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsQuestionInputVisible(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" size="sm" className="gap-2">
                              <Send className="w-3 h-3" />
                              Submit
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
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

      <div className="fixed bottom-14 left-0 right-0 p-4 md:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <div className="w-1/2 md:ml-auto pointer-events-auto">
            <Card className="border-none bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-0">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src={`https://open.spotify.com/embed/track/${props.data.id}?utm_source=generator`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
