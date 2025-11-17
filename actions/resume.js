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

  // Parse industry to get main industry and sub-industry
  let industry = user.industry || "";
  let subIndustry = "";
  if (user.industry) {
    const parts = user.industry.split("-");
    industry = parts[0] || "";
    subIndustry = parts.slice(1).join(" ").replace(/-/g, " ") || "";
  }

  // Build personalized context
  const experienceLevel = user.experience 
    ? user.experience === 0 
      ? "entry-level" 
      : user.experience < 3 
        ? "junior" 
        : user.experience < 7 
          ? "mid-level" 
          : user.experience < 12 
            ? "senior" 
            : "executive/leadership"
    : "professional";

  const skillsList = user.skills && user.skills.length > 0 
    ? user.skills.join(", ") 
    : "general professional skills";

  const bioContext = user.bio 
    ? `\n  - **Professional Background:** ${user.bio.substring(0, 200)}${user.bio.length > 200 ? "..." : ""}`
    : "";

  const prompt = `
  You are a senior professional resume writer specializing in high-impact career branding and ATS optimization.
  
  Your task is to improve the following **${type}** description for a **${experienceLevel}** professional in the **${industry}${subIndustry ? ` - ${subIndustry}` : ""}** industry.
  
  ---
  
  ## 👤 Candidate Profile:
  - **Experience Level:** ${experienceLevel} (${user.experience || 0} years of experience)
  - **Industry:** ${industry}${subIndustry ? ` - ${subIndustry}` : ""}
  - **Key Skills:** ${skillsList}${bioContext}
  
  ---
  
  ## ✏️ Current Content:
  "${current}"
  
  ---
  
  ## 🎯 Rewrite Goals:
  - Transform the text into a **concise, results-driven** resume bullet or paragraph appropriate for a ${experienceLevel} professional
  - Use **strong action verbs** that match the candidate's experience level and industry
  - **Quantify results** with numbers, percentages, or specific outcomes where applicable
  - Integrate relevant **technical and domain-specific skills** from: ${skillsList}
  - Focus on **achievements**, not just responsibilities
  - Align with **modern ATS-friendly** formatting using industry-specific **keywords** relevant to ${industry}${subIndustry ? ` and ${subIndustry}` : ""}
  - Match the tone and complexity to a ${experienceLevel} professional's typical accomplishments
  
  ---
  
  ## ✅ Output Requirements:
  - Format the improved version as **one impactful paragraph**
  - **Do not** include headings, markdown, or any explanation — just the rewritten content
  - Keep the tone professional, confident, and concise
  - Ensure the language reflects ${experienceLevel} level expertise and achievements
  
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
