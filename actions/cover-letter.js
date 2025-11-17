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
  
  ---
  
  ## 👤 Candidate Profile
  - **Name:** ${candidateName}
  - **Email:** ${candidateEmail}
  - **Experience Level:** ${experienceLevel} (${user.experience || 0} years of experience)
  - **Industry:** ${industry}${subIndustry ? ` - ${subIndustry}` : ""}
  - **Key Skills:** ${skillsList}
  - **Professional Background:** ${user.bio || "Experienced professional with a strong track record in their field"}
  
  ---
  
  ## 📄 Job Description
  ${data.jobDescription}
  
  ---
  
  ## 🛠️ Writing Guidelines
  - **Tone:** Professional, confident, and enthusiastic - appropriate for a ${experienceLevel} professional
  - **Length:** No more than **400 words**
  - **Structure:** Use proper business letter format, in **Markdown**
  - **Header:** Begin with the candidate's name and email on separate lines before the salutation
  - **Voice:** Write in the first person, from the candidate's perspective
  - **Personalization:** Reference specific skills (${skillsList}) and experience in ${industry}${subIndustry ? `, particularly ${subIndustry}` : ""}
  - **Avoid:** Generic phrases, repetition, or filler content
  
  ---
  
  ## ✅ Output Requirements
  - Start with an engaging introduction showing intent and relevance to the role
  - Highlight specific accomplishments and skills (${skillsList}) that align with the job requirements
  - Reference the candidate's ${user.experience || 0} years of experience in ${industry}${subIndustry ? `, specifically ${subIndustry}` : ""}
  - Emphasize the unique value the candidate brings to ${data.companyName}
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
