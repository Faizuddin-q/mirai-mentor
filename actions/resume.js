"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { checkUser } from "@/lib/checkUser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function createResume(title) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure user exists in database (creates if doesn't exist)
  const user = await checkUser();
  if (!user) {
    throw new Error("Unable to initialize user profile. Please try again.");
  }

  try {
    const resume = await db.resume.create({
      data: {
        userId: user.id,
        title: title || "My Resume",
        content: "",
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error creating resume:", error);
    // Provide more specific error messages
    if (error.code === "P2002") {
      throw new Error("A resume with this title already exists. Please choose a different title.");
    }
    if (error.code === "P2003") {
      throw new Error("Invalid user reference. Please try logging in again.");
    }
    throw new Error(error.message || "Failed to create resume. Please try again.");
  }
}

export async function saveResume(resumeId, content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.update({
      where: {
        id: resumeId,
        userId: user.id, // Ensure user owns this resume
      },
      data: {
        content,
      },
    });

    revalidatePath("/resume");
    revalidatePath(`/resume/${resumeId}`);
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResumes() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getResume(resumeId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      id: resumeId,
      userId: user.id, // Ensure user owns this resume
    },
  });
}

export async function deleteResume(resumeId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    await db.resume.delete({
      where: {
        id: resumeId,
        userId: user.id, // Ensure user owns this resume
      },
    });

    revalidatePath("/resume");
    return { success: true };
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw new Error("Failed to delete resume");
  }
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
  
  Your task is to improve the following **${type}** description for a **${experienceLevel}** professional in the **${industry}${subIndustry ? ` ${subIndustry}` : ""}** industry.
  
  ---
  
  ## 👤 Candidate Profile:
  - **Experience Level:** ${experienceLevel} (${user.experience || 0} years of experience)
  - **Industry:** ${industry}${subIndustry ? ` ${subIndustry}` : ""}
  - **Key Skills:** ${skillsList}${bioContext}
  
  ---
  
  ## ✏️ Current Content:
  "${current}"
  
  ---
  
  ## 🎯 Rewrite Goals:
  - Transform the text into a concise, results-driven resume bullet or paragraph appropriate for a ${experienceLevel} professional
  - Use strong action verbs that match the candidate's experience level and industry
  - **CRITICAL: Only include numbers, percentages, or quantifications if they are already present in the current content. Do NOT invent or add any numbers, percentages, or metrics that are not in the original text.**
  - Integrate relevant technical and domain-specific skills from: ${skillsList}
  - Focus on achievements, not just responsibilities
  - Align with modern ATS-friendly formatting using industry-specific keywords relevant to ${industry}${subIndustry ? ` and ${subIndustry}` : ""}
  - Match the tone and complexity to a ${experienceLevel} professional's typical accomplishments
  
  ---
  
  ## ✅ Output Requirements:
  - Format the improved version as one impactful paragraph
  - Do not include headings, markdown, or any explanation. Just the rewritten content.
  - Keep the tone simple, plain English, professional, confident, and concise
  - **Writing Style Rules:**
    - Use simple, plain English. Avoid complex sentence structures.
    - Do NOT use apostrophes except for possessives like "John's" or contractions like "it's", "don't", "can't"
    - Do NOT use em dashes or dashes. Use commas or periods instead.
    - Do NOT add any numbers, percentages, or quantifications unless they exist in the current content.
    - Keep language natural and realistic. Avoid overly formal or flowery language.
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
