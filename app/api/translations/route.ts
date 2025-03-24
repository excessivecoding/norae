import { getCachedLyrics } from "@/app/actions";
import { redis } from "@/app/redis";
import { translate } from "@/app/translation";
import { z } from "zod";

export async function POST(request: Request) {
  const data = await request.json();

  const result = z
    .object({
      songId: z.string(),
      lineIndex: z.number(),
    })
    .safeParse(data);

  if (!result.success) {
    return new Response(result.error.message, { status: 400 });
  }

  const { songId, lineIndex } = result.data;
  const lyrics = await getCachedLyrics({ id: songId });
  if (!lyrics) {
    return new Response("No lyrics found", { status: 404 });
  }

  const text = lyrics.split("\n")[lineIndex];

  try {
    // Try to get cached translation first
    const cacheKey = `translations:${songId}/${text}`;
    const cachedTranslation = (await redis.get(cacheKey)) as Awaited<
      ReturnType<typeof translate>
    >;

    if (cachedTranslation) {
      console.log("Cache hit for translation:", songId, text.substring(0, 20));
      return Response.json(cachedTranslation);
    }

    // If not cached, call the translation service
    const translation = await translate(text);

    // Store in cache for future requests
    await redis.set(cacheKey, translation);
    console.log("Cached translation for:", songId, text.substring(0, 20));

    return Response.json(translation);
  } catch (error) {
    console.error("Translation error:", error);
    return Response.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
