"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateAnswer(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
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

  const candidateName =
    user.name ||
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    "Your Name";

  // Build experience level context
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

  // Build the prompt
  let prompt = `
  You are an expert career coach and interview preparation specialist helping candidates answer questions from companies during the hiring process.
  
  Your task is to generate a comprehensive, professional, and well-structured answer to a question asked by **${data.companyName}**.
  
  ---
  
  ## 👤 Candidate Profile
  - **Name:** ${candidateName}
  - **Experience Level:** ${experienceLevel} (${user.experience || 0} years of experience)
  - **Industry:** ${industry}${subIndustry ? ` ${subIndustry}` : ""}
  - **Key Skills:** ${skillsList}
  - **Professional Background:** ${user.bio || "Experienced professional with a strong track record in their field"}
  
  ---
  
  ## 🏢 Company Information
  - **Company Name:** ${data.companyName}
  ${data.companyJD ? `- **Company/Job Description:** ${data.companyJD}` : ""}
  
  ---
  
  ## ❓ Question Asked by Company
  ${data.question}
  
  ---
  
  ## 🎯 Your Task
  Generate a professional, thoughtful, and well-structured answer to the question that:
  - Demonstrates the candidate's expertise and experience level (${experienceLevel})
  - Aligns with the candidate's background in ${industry}${subIndustry ? `, specifically ${subIndustry}` : ""}
  - Highlights relevant skills: ${skillsList}
  - Shows understanding of the company context (${data.companyName})
  ${data.companyJD ? "- References relevant aspects from the company/job description" : ""}
  - Is authentic, professional, and compelling
  - Provides specific examples or insights when appropriate
  
  ---
  
  ## 🛠️ Writing Guidelines
  - **Tone:** Professional, confident, and authentic, appropriate for a ${experienceLevel} professional
  - **Length:** Comprehensive but concise (approximately 150-300 words, depending on the question complexity)
  - **Structure:** Well-organized with clear paragraphs
  - **Voice:** Write in the first person, from the candidate's perspective
  - **Personalization:** Reference specific skills (${skillsList}) and experience in ${industry}${subIndustry ? `, particularly ${subIndustry}` : ""}
  - **Writing Style Rules:**
    - Use simple, plain English. Avoid complex sentence structures.
    - Do NOT use apostrophes except for possessives like "John's" or contractions like "it's", "don't", "can't"
    - Do NOT use em dashes or dashes. Use commas or periods instead.
    - Keep language natural and realistic. Avoid overly formal or flowery language.
    - Write in a conversational yet professional tone that sounds authentic.
  
  ---
  
  ## ✅ Output Requirements
  - Start with a direct, clear response to the question
  - Provide specific examples or experiences when relevant
  - Connect your answer to the candidate's background and the company's context
  - End with a strong closing that reinforces the candidate's value
  - Return only the answer in Markdown format
  - Do not include headings, commentary, or extra text
  - Keep the writing simple, clear, and easy to read
  
  Begin when ready.
  `;

  try {
    const result = await model.generateContent(prompt);
    const answer = result.response.text().trim();

    return {
      answer,
      companyName: data.companyName,
      question: data.question,
    };
  } catch (error) {
    console.error("Error generating answer:", error.message);
    throw new Error("Failed to generate answer");
  }
}

