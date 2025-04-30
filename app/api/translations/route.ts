import { getCachedLyrics } from "@/app/actions";
import { rateLimit, redis } from "@/app/redis";
import { translate } from "@/app/translation";
import { auth } from "@/auth";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

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
    const email = session.user.email;

    // const { success } = await rateLimit.limit(`${email}/ai`);

    // if (!success) {
    //   return new Response("Rate limit exceeded", { status: 429 });
    // }

    // special condition for korean friend that wants to translate to korean
    // don't overcomplicate things
    const language = [process.env.KOREAN_EMAIL_ENABLED].includes(email)
      ? "korean"
      : "english";

    const cacheKey = `translations/${language}/${songId}/${text}`;
    const cachedTranslation = (await redis.get(cacheKey)) as Awaited<
      ReturnType<typeof translate>
    >;

    if (cachedTranslation) {
      console.log("Cache hit for translation:", songId, text.substring(0, 20));
      return Response.json(cachedTranslation);
    }

    const translation = await translate(text, language);

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
