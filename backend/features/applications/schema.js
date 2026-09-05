import { z } from "zod";

export const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobType: z.enum(["FULL_TIME", "INTERN", "REMOTE", "HYBRID", "CONTRACT"]),
  jobLink: z.union([z.string().url("Invalid URL"), z.literal(""), z.undefined()]).optional(),
  status: z.enum(["WISHLIST", "APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"]),
  nextAction: z.string().optional(),
  appliedAt: z.coerce.date().optional(),
  resumeSourceType: z.enum(["INTERNAL", "FILE_UPLOAD", "EXTERNAL_LINK", "TEXT_PASTE", "NONE"]).optional(),
  resumeReference: z.string().optional(),
  resumePdfPath: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["WISHLIST", "APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"]),
  note: z.string().optional(),
});
