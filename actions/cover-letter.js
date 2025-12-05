"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateCoverLetter(data) {
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
  const candidateEmail =
    user.email ||
    clerkUser.emailAddresses?.find((email) => email.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ||
    clerkUser.emailAddresses?.[0]?.emailAddress ||
    "your@email.com";

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

  const prompt = `
  You are an expert cover letter writer with a deep understanding of career storytelling, persuasive writing, and job-market alignment.
  
  Your task is to generate a highly personalized, professional, and compelling cover letter for the position of **${data.jobTitle}** at **${data.companyName}**.
  
  ---
  
  ## 🎯 Objective
  Write a cover letter that:
  - Positions the candidate as an ideal fit for the role based on their ${experienceLevel} experience level
  - Clearly aligns the candidate's experience, skills, and background with the job description
  - Demonstrates knowledge of the company's goals or values
  - Includes relevant, quantified achievements appropriate for a ${experienceLevel} professional
  - Builds enthusiasm and professionalism throughout
  - Uses industry-specific language and terminology relevant to ${industry}${subIndustry ? ` and ${subIndustry}` : ""}
  - Written in simple, plain English without unnecessary complexity
  
  ---
  
  ## 👤 Candidate Profile
  - **Name:** ${candidateName}
  - **Email:** ${candidateEmail}
  - **Experience Level:** ${experienceLevel} (${user.experience || 0} years of experience)
  - **Industry:** ${industry}${subIndustry ? ` ${subIndustry}` : ""}
  - **Key Skills:** ${skillsList}
  - **Professional Background:** ${user.bio || "Experienced professional with a strong track record in their field"}
  
  ---
  
  ## 📄 Job Description
  ${data.jobDescription}
  
  ---
  
  ## 🛠️ Writing Guidelines
  - **Tone:** Professional, confident, and enthusiastic, appropriate for a ${experienceLevel} professional
  - **Length:** No more than 200 words
  - **Structure:** Use proper business letter format, in Markdown
  - **Header:** Begin with the candidate's name and email on separate lines before the salutation
  - **Voice:** Write in the first person, from the candidate's perspective
  - **Personalization:** Reference specific skills (${skillsList}) and experience in ${industry}${subIndustry ? `, particularly ${subIndustry}` : ""}
  - **Avoid:** Generic phrases, repetition, or filler content
  - **Writing Style Rules:**
    - Use simple, plain English. Avoid complex sentence structures.
    - Do NOT use apostrophes except for possessives like "John's" or contractions like "it's", "don't", "can't"
    - Do NOT use em dashes or dashes. Use commas or periods instead.
    - Keep language natural and realistic. Avoid overly formal or flowery language.
    - Write in a conversational yet professional tone that sounds authentic.
  
  ---
  
  ## ✅ Output Requirements
  - Start with an engaging introduction showing intent and relevance to the role
  - Highlight specific accomplishments and skills (${skillsList}) that align with the job requirements
  - Reference the candidate's ${user.experience || 0} years of experience in ${industry}${subIndustry ? `, specifically ${subIndustry}` : ""}
  - Emphasize the unique value the candidate brings to ${data.companyName}
  - Close with a strong call to action (e.g. request for interview)
  - Return only the completed letter in Markdown format
  - Do not include headings, commentary, or extra text
  - Keep the writing simple, clear, and easy to read
  
  Begin when ready.
  `;
  

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function saveCoverLetter(id, content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const coverLetter = await db.coverLetter.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        content,
      },
    });

    revalidatePath("/ai-cover-letter");
    revalidatePath(`/ai-cover-letter/${id}`);
    return coverLetter;
  } catch (error) {
    console.error("Error saving cover letter:", error);
    throw new Error("Failed to save cover letter");
  }
}

export async function enhanceCoverLetter(id, currentContent) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // Get the cover letter to access job details
  const coverLetter = await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!coverLetter) throw new Error("Cover letter not found");

  // Parse industry to get main industry and sub-industry
  let industry = user.industry || "";
  let subIndustry = "";
  if (user.industry) {
    const parts = user.industry.split("-");
    industry = parts[0] || "";
    subIndustry = parts.slice(1).join(" ").replace(/-/g, " ") || "";
  }

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

  const prompt = `
  You are an expert cover letter writer specializing in enhancing and improving existing cover letters.
  
  Your task is to enhance and improve the following cover letter for the position of **${coverLetter.jobTitle}** at **${coverLetter.companyName}**.
  
  ---
  
  ## 👤 Candidate Profile:
  - **Experience Level:** ${experienceLevel} (${user.experience || 0} years of experience)
  - **Industry:** ${industry}${subIndustry ? ` ${subIndustry}` : ""}
  - **Key Skills:** ${skillsList}
  - **Professional Background:** ${user.bio || "Experienced professional with a strong track record in their field"}
  
  ---
  
  ## 📄 Current Cover Letter:
  "${currentContent}"
  
  ---
  
  ## 🎯 Enhancement Goals:
  - Improve clarity, flow, and readability while preserving the user's original intent and key points
  - Strengthen the connection between the candidate's experience and the job requirements
  - Enhance the professional tone and impact
  - Make the letter more compelling and persuasive
  - Ensure proper business letter format in Markdown
  - Keep the length appropriate (around 200 words)
  - Use industry-specific language relevant to ${industry}${subIndustry ? ` and ${subIndustry}` : ""}
  - Maintain the first-person perspective
  
  ---
  
  ## 🛠️ Writing Guidelines:
  - **Tone:** Professional, confident, and enthusiastic, appropriate for a ${experienceLevel} professional
  - **Writing Style Rules:**
    - Use simple, plain English. Avoid complex sentence structures.
    - Do NOT use apostrophes except for possessives like "John's" or contractions like "it's", "don't", "can't"
    - Do NOT use em dashes or dashes. Use commas or periods instead.
    - Keep language natural and realistic. Avoid overly formal or flowery language.
    - Write in a conversational yet professional tone that sounds authentic.
  - **Preserve:** Keep the user's specific edits, personal touches, and unique points they added
  - **Enhance:** Improve grammar, word choice, sentence structure, and overall impact
  
  ---
  
  ## ✅ Output Requirements:
  - Return only the enhanced cover letter in Markdown format
  - Do not include headings, commentary, or extra text
  - Maintain the same structure and key points as the original
  - Keep the writing simple, clear, and easy to read
  - Ensure the letter starts with the candidate's name and email before the salutation
  
  Return only the enhanced cover letter. Begin.
  `;

  try {
    const result = await model.generateContent(prompt);
    const enhancedContent = result.response.text().trim();

    // Save the enhanced content
    const updatedCoverLetter = await db.coverLetter.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        content: enhancedContent,
      },
    });

    revalidatePath("/ai-cover-letter");
    revalidatePath(`/ai-cover-letter/${id}`);
    return updatedCoverLetter;
  } catch (error) {
    console.error("Error enhancing cover letter:", error);
    throw new Error("Failed to enhance cover letter");
  }
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
