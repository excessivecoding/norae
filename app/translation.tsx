import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "./openai";

export type TranslationResult = z.infer<typeof translationResultSchema>;

export const infinitiveSchema = z.object({
  text: z.string(),
  explanation: z.string(),
  translation: z.string(),
});

export const breakdownItemSchema = z.object({
  text: z.string(),
  translation: z.string().optional(),
  explanation: z.string().optional(),
  infinitive: infinitiveSchema.optional(),
  is_particle: z.boolean().optional(),
  examples: z.array(z.string()).min(1),
});

export const translationResultSchema = z.object({
  source: z.string(),
  translation: z.string(),
  breakdown: z.array(breakdownItemSchema),
});

const translationFromKoreanSystemPrompt = `
you are an expert english translator that speak all languages in the world.
always answer in JSON as we will use the output into our app

do a breakdown of the lyrics into separate parts by space. give as much detail as possible and give at least one example for each breakdown.

if the lyrics is already in target language, just return the lyrics as is
`;

function userPrompt(language: string, text: string, context?: string) {
  return `
  <target_language>${language}</target_language>
  <text>${text}</text>
  <context>${context || "no specific context"}</context>
  `;
}

export async function translateFromKorean(text: string) {
  const { object } = await generateObject({
    model: openai("gpt-4-turbo"),
    schema: translationResultSchema,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: translationFromKoreanSystemPrompt,
      },
      {
        role: "user",
        content: userPrompt("english", text),
      },
    ],
  });

  return object;
}
