"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

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

  const prompt = `
  You are an expert cover letter writer with a deep understanding of career storytelling, persuasive writing, and job-market alignment.
  
  Your task is to generate a highly personalized, professional, and compelling cover letter for the position of **${data.jobTitle}** at **${data.companyName}**.
  
  ---
  
  ## 🎯 Objective
  Write a cover letter that:
  - Positions the candidate as an ideal fit for the role
  - Clearly aligns the candidate’s experience and skills with the job description
  - Demonstrates knowledge of the company’s goals or values
  - Includes relevant, quantified achievements
  - Builds enthusiasm and professionalism throughout
  
  ---
  
  ## 👤 Candidate Details
  - **Industry:** ${user.industry}
  - **Years of Experience:** ${user.experience}
  - **Key Skills:** ${user.skills?.join(", ") || "N/A"}
  - **Professional Summary:** ${user.bio}
  - **Name:** ${candidateName}
  - **Email:** ${candidateEmail}
  
  ---
  
  ## 📄 Job Description
  ${data.jobDescription}
  
  ---
  
  ## 🛠️ Writing Guidelines
  - **Tone:** Professional, confident, and enthusiastic
  - **Length:** No more than **400 words**
  - **Structure:** Use proper business letter format, in **Markdown**
  - **Header:** Begin with the candidate's name and email on separate lines before the salutation
  - **Voice:** Write in the first person, from the candidate’s perspective
  - **Avoid:** Generic phrases, repetition, or filler content
  
  ---
  
  ## ✅ Output Requirements
  - Start with an engaging introduction showing intent and relevance
  - Highlight specific accomplishments that align with the role
  - Emphasize value the candidate brings to the company
  - Close with a strong call to action (e.g. request for interview)
  - Return only the completed letter in **Markdown** format
  - Do not include headings, commentary, or extra text
  
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
