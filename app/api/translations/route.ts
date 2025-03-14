import { translateFromKorean } from "@/app/translation";
import { getValue, setValue } from "@/lib/cloudflare";
import { z } from "zod";

export async function POST(request: Request) {
  const data = await request.json();

  const result = z
    .object({
      songId: z.string(),
      text: z.string(),
    })
    .safeParse(data);

  if (!result.success) {
    return new Response(result.error.message, { status: 400 });
  }

  const { songId, text } = result.data;

  try {
    // Try to get cached translation first
    const cacheKey = `translations:${songId}/${text}`;
    const cachedTranslation = await getValue(cacheKey);

    if (cachedTranslation) {
      console.log("Cache hit for translation:", songId, text.substring(0, 20));
      return Response.json(JSON.parse(cachedTranslation));
    }

    // If not cached, call the translation service
    const translation = await translateFromKorean(text);

    // Store in cache for future requests
    await setValue(cacheKey, JSON.stringify(translation));
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
