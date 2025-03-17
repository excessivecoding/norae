import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
});
