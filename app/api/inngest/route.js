import { serve } from "inngest/next";

import { inngest } from "@/backend/inngest/client";
import { generateIndustryInsights } from "@/backend/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateIndustryInsights],
});
