import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  baseURL: `https://gateway.ai.cloudflare.com/v1/8180e951c3c180724ceac2921a96b823/norae/openai`,
});
