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
  text: z.string().describe("the text to translate"),
  translation: z.string().optional().describe("the translation of the text"),
  explanation: z.string().optional().describe("the explanation of the text"),
  infinitive: infinitiveSchema
    .optional()
    .describe("the infinitive of the word if there is any"),
  examples: z
    .array(z.string())
    .min(2)
    .describe(
      "examples of the text used in at least 1 simple sentence and 1 more complex sentence"
    ),
  romanization: z
    .string()
    .optional()
    .nullable()
    .describe(
      "the romanization of the text if the language is not latin based (like korean or japanese)"
    ),
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

for language like korean or japanese, give the romanization of the lyrics; no need to give the romanization for latin based languages like english, spanish, french, etc.
`;

function userPrompt(language: string, text: string, context?: string) {
  return `
  <target_language>${language}</target_language>
  <text>${text}</text>
  <context>${context || "no specific context"}</context>
  `;
}

export async function translate(text: string, language: string = "english") {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: translationResultSchema,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: translationFromKoreanSystemPrompt,
      },
      {
        role: "user",
        content: userPrompt(language, text),
      },
    ],
  });

  return object;
}
