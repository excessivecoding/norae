import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const openai = createOpenAI({
  baseURL: `https://gateway.ai.cloudflare.com/v1/8180e951c3c180724ceac2921a96b823/norae/openai`,
});

export type TranslationResult = z.infer<typeof translationResultSchema>;

// Zod schema for TranslationResult
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
});

export const translationResultSchema = z.object({
  source: z.string(),
  translation: z.string(),
  breakdown: z.array(breakdownItemSchema),
});

const exampleKoreanText =
  "저는 아무하고도 얘기하고 싶지 않아요. 우리는 동님아시아에 어디나 갈 거예요. 우리는 한국에서 태국으로 가요. 모든 아시아 사람들은 젓가락을 잘 쓴다.";

const exampleEnglishText =
  "I don't want to talk to anybody. we're going everywhere in Southeast Asia. We are going from Korea to Thailand. All Asian people use chopsticks well.";

const exampleTranslationBreakdown = [
  // 저는 아무하고도 얘기하고 싶지 않아요.
  {
    text: "저",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "는",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    is_particle: true,
  },
  { text: " " },
  {
    text: "아무하고도",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "얘기하",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    infinitive: {
      text: "얘기하다",
      translation: "<direct translation in english>",
      explanation: "<your explanation>",
    },
  },
  {
    text: "고 싶지 않아요",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    infinitive: {
      text: "고 싶지 않다",
      translation: "<direct translation in english>",
      explanation: "<your explanation>",
    },
  },
  // {
  //   text: "나",
  //   translation: "<direct translation in english>",
  //   explanation: "<your explanation>",
  // },
  // {
  //   text: "는",
  //   translation: "<direct translation in english>",
  //   explanation: "<your explanation>",
  //   is_particle: true,
  // },
  // { text: " " },
  // {
  //   text: "한국어",
  //   translation: "<direct translation in english>",
  //   explanation: "<your explanation>",
  // },
  // {
  //   text: "를",
  //   translation: "<direct translation in english>",
  //   explanation: "<your explanation>",
  //   is_particle: true,
  // },
  // { text: " " },
  // {
  //   text: "배우",
  //   translation: "<direct translation in english>",
  //   explanation: "<your explanation>",
  //   infinitive: {
  //     text: "배우다",
  //     translation: "<direct translation in english>",
  //     explanation: "<your explanation>",
  //   },
  // },
  // {
  //   text: "고 싶어요",
  //   type: "auxiliary-verb",
  //   translation: "<direct translation in english>",
  //   explanation: "<your explanation>",
  //   infinitive: {
  //     text: "-고 싶다",
  //     translation: "<direct translation in english>",
  //     explanation: "<your explanation>",
  //   },
  // },
  { text: "." },
  { text: " " },
  {
    text: "우리",
    explanation: "<your explanation>",
    translation: "<direct translation in english>",
  },
  {
    text: "는",
    explanation: "<your explanation>",
    translation: "<direct translation in english>",
    is_particle: true,
  },
  { text: " " },
  {
    text: "동남아시아",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "-에",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    is_particle: true,
  },
  { text: " " },
  {
    text: "어디나",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  { text: " " },
  {
    text: "갈 거예요",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    infinitive: {
      text: "가다",
      translation: "<direct translation in english>",
      explanation: "<your explanation>",
    },
  },
  { text: "." },
  {
    text: "우리",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "는",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    is_particle: true,
  },
  { text: " " },
  {
    text: "한국",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "에서",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    is_particle: true,
  },
  { text: " " },
  {
    text: "태국",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "으로",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    is_particle: true,
  },
  { text: " " },
  {
    text: "가요",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    infinitive: {
      text: "가다",
      translation: "<direct translation in english>",
      explanation: "<your explanation>",
    },
  },
  { text: "." },
  {
    text: "모든",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  { text: " " },
  {
    text: "아시아",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "사람",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "들",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    is_particle: true,
  },
  {
    text: "은",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    is_particle: true,
  },
  { text: " " },
  {
    text: "젓가락",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  {
    text: "을",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    is_particle: true,
  },
  { text: " " },
  {
    text: "잘",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
  },
  { text: " " },
  {
    text: "쓴다",
    translation: "<direct translation in english>",
    explanation: "<your explanation>",
    infinitive: {
      text: "쓰다",
      translation: "<direct translation in english>",
      explanation: "<your explanation>",
    },
  },
  { text: "." },
] satisfies TranslationResult["breakdown"];

const breakdownRules = `
  rules that are MANDATORY to follow for the \`breakdown\`:
  1. always separate the particle from the word it is attached to
  2. make sure to always breakdown compound into separate parts
  3. respect vocabulary close to speaking / usable language
  4. all punctuations spaces and special characters should just be text as there is no translations / explaination required
`;

const exampleFromKoreanTranslationOutput: TranslationResult = {
  source: exampleKoreanText,
  translation: exampleEnglishText,
  breakdown: exampleTranslationBreakdown,
};

const translationFromKoreanSystemPrompt = `
you are an expert in korean.
always answer in JSON as we will use the output into our app
INPUT: ${exampleKoreanText}
OUTPUT: ${JSON.stringify(exampleFromKoreanTranslationOutput)}

${breakdownRules}
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

// export const translateFromKorean = createServerFn()
//   .validator(z.object({ text: z.string() }))
//   .middleware([cloudflareMiddleware])
//   .handler(async (ctx) => {
//     const anthropic = createAnthropic({
//       apiKey: ctx.context.cloudflare.ANTHROPIC_API_KEY,
//     });
//     const { text: result } = await generateText({
//       model: anthropic("claude-3-5-sonnet-20241022"),
//       // model: openai("gpt-4o"),
//       temperature: 0,
//       messages: [
//         {
//           role: "system",
//           content: translationFromKoreanSystemPrompt,
//         },
//         {
//           role: "user",
//           content: userPrompt("english", ctx.data.text),
//         },
//       ],
//     });

//     const start = result.indexOf("{");
//     const end = result.lastIndexOf("}");
//     const rawData = result.substring(start, end + 1);

//     return JSON.parse(rawData) as TranslationResult;
//   });

// const exampleToKoreanTranslationOutput: TranslationResult = {
//   source: exampleEnglishText,
//   translation: exampleKoreanText,
//   breakdown: exampleTranslationBreakdown,
// };

// const translationToKoreanSystemPrompt = `
// you are an expert in korean.
// always answer in JSON as we will use the output into our app
// INPUT: ${exampleEnglishText}
// OUTPUT: ${JSON.stringify(exampleToKoreanTranslationOutput)}

// ${breakdownRules}
// `;
// export async function translateToKorean(text: string[]) {
//   const { text: result } = await generateText({
//     model: openai("gpt-4o"),
//     temperature: 0,
//     messages: [
//       { role: "system", content: translationToKoreanSystemPrompt },
//       {
//         role: "user",
//         content: userPrompt("korean", text),
//       },
//     ],
//   });

//   const start = result.indexOf("{");
//   const end = result.lastIndexOf("}");
//   const rawData = result.substring(start, end + 1);

//   return JSON.parse(rawData) as TranslationResult;
// }
