import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "mirai-mentor", // Unique app ID
  name: "Mirai Mentor",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
