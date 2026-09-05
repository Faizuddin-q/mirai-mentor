import { z } from "zod";

export const smartAnswerDeskSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyJD: z.string().optional(),
  question: z.string().min(1, "Question is required"),
});
