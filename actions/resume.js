"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
  You are a senior professional resume writer specializing in high-impact career branding.
  
  Your task is to improve the following **${type}** description for a professional in the **${user.industry}** industry.
  
  ---
  
  ## ✏️ Current Content:
  "${current}"
  
  ---
  
  ## 🎯 Rewrite Goals:
  - Transform the text into a **concise, results-driven** resume bullet or paragraph
  - Use **strong action verbs** to start the sentence(s)
  - **Quantify results** with numbers, percentages, or specific outcomes where applicable
  - Integrate relevant **technical and domain-specific skills**
  - Focus on **achievements**, not just responsibilities
  - Align with **modern ATS-friendly** formatting using industry-specific **keywords**
  
  ---
  
  ## ✅ Output Requirements:
  - Format the improved version as **one impactful paragraph**
  - **Do not** include headings, markdown, or any explanation — just the rewritten content
  - Keep the tone professional, confident, and concise
  
  Return only the improved content. Begin.
  `;
  

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}
