"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
  const experienceLevel = String(user.experience);

  const skillsList =
    user.skills && user.skills.length > 0
      ? user.skills.join(", ")
      : "general professional skills";

  const lowerQuestion = (data.question || "").toLowerCase();

  // Detect "why join this company" style questions
  const isWhyJoinQuestion = [
    "why do you want to join",
    "why would you like to join",
    "why do you want to work",
    "why work here",
    "why this company",
    "why our company",
    "what interests you about our company",
    "motivate your interest in our company",
    "why are you interested in this company",
    "why do you want to be part of",
    "why do you want to apply to",
    " what excites you about ",
  ].some((phrase) => lowerQuestion.includes(phrase));

  let prompt;

  if (isWhyJoinQuestion) {
    // Special prompt for "why join this company" questions
    prompt = `
You are an expert career coach and interview preparation specialist helping candidates answer "why this company" style questions.

The company has asked the candidate a "why join this company" type question. Use the information below and your own knowledge about ${data.companyName} to write a simple, human, and sincere answer.

---

## Candidate Profile
- Name: ${candidateName}
- Experience Level: ${experienceLevel} (${user.experience || 0} years of experience)
- Industry: ${industry}${subIndustry ? ` ${subIndustry}` : ""}
- Key Skills: ${skillsList}
- Professional Background: ${
      user.bio ||
      "Experienced professional with a strong track record in their field"
    }

---

## Company Information
- Company Name: ${data.companyName}
${data.companyJD ? `- Company or Job Description: ${data.companyJD}` : ""}

Use your own knowledge about ${data.companyName} to mention, when possible:
- Main products or services
- Who the typical users or customers are
- What makes the company different, its unique value or USP
- Any known focus areas such as user experience, scale, innovation, quality, learning culture, impact

If you are not fully sure, keep the details realistic and slightly general for a modern company in this space.

---

## Question Asked by Company
${data.question}

---

## Answer Structure

Write the answer in 3 to 5 short paragraphs in the first person.

1. Start with a clear and direct sentence that answers why I want to join ${data.companyName}.
2. In the next paragraph, talk about what excites me about the companys products, services, technology, users, or mission. Use concrete, down to earth details, not buzzwords.
3. In the next paragraph, connect the companys culture, values, way of working, and learning environment with what I am looking for. You can touch on ideas like learning and growth, ownership, collaboration, user focus, real world impact, problem solving, and innovation.
4. In the final paragraph, clearly align my skills and background in ${industry}${
      subIndustry ? `, especially ${subIndustry}` : ""
    } with what ${data.companyName} does. Make it clear how I can contribute and what I hope to learn. This paragraph should contain the most user aligned content about my skills, projects, experience, and goals.

---

## Writing Guidelines

- Tone: simple, warm, professional, and human
- Use plain English and short sentences that a non native speaker can understand
- Avoid buzzwords and generic phrases that sound like AI
- Do not use any kind of dash such as -, --, or —
- It is OK to show a bit of personality and curiosity
- Use the first person "I"
- Return only the answer text in Markdown with normal paragraphs, no headings, no bullet points, no lists

Begin when ready.
`;
  }
  else {
    // Default prompt for all other questions
    prompt = `
You are an expert career coach and interview preparation specialist helping candidates answer questions from companies during the hiring process.

Your task is to generate a comprehensive, professional, and well structured answer to a question asked by ${data.companyName}.

---

## Candidate Profile
- Name: ${candidateName}
- Experience Level: ${experienceLevel} (${user.experience || 0} years of experience)
- Industry: ${industry}${subIndustry ? ` ${subIndustry}` : ""}
- Key Skills: ${skillsList}
- Professional Background: ${
      user.bio ||
      "Experienced professional with a strong track record in their field"
    }

---

## Company Information
- Company Name: ${data.companyName}
${data.companyJD ? `- Company or Job Description: ${data.companyJD}` : ""}

---

## Question Asked by Company
${data.question}

---

## Your Task

Generate a professional, thoughtful, and well structured answer to the question that:
- Demonstrates the candidates expertise and experience level (${experienceLevel})
- Aligns with the candidates background in ${industry}${
      subIndustry ? `, specifically ${subIndustry}` : ""
    }
- Highlights relevant skills: ${skillsList}
- Shows understanding of the company context (${data.companyName})
${
  data.companyJD
    ? "- References relevant aspects from the company or job description"
    : ""
}
- Is authentic, professional, and compelling
- Provides specific examples or insights when appropriate

---

## Writing Guidelines

- Tone: professional, confident, and authentic, appropriate for a ${experienceLevel} professional
- Length: comprehensive but concise, around 150 to 300 words depending on the question
- Structure: well organized with clear paragraphs
- Voice: write in the first person, from the candidates perspective
- Personalization: mention specific skills (${skillsList}) and experience in ${industry}${
      subIndustry ? `, particularly ${subIndustry}` : ""
    }
- The final paragraph must clearly align my skills, experience, and goals with the companys needs and the role. This last paragraph should feel very personal and user aligned.
- Use simple, plain English and short sentences. Avoid complex sentence structures.
- Do not use any kind of dash such as -, --, or —. Use commas or periods instead.
- Keep language natural and realistic. Avoid overly formal, stiff, or flowery language.
- Avoid generic AI style phrases. Write like a real person who is thinking carefully.

---

## Output Requirements

- Start with a direct, clear response to the question
- Provide specific examples or experiences when relevant
- Connect the answer to the candidates background and the companys context
- End with a strong closing that reinforces the candidates value and fit
- Return only the answer in Markdown format
- Do not include headings, commentary, or extra text
- Use only normal paragraphs, no bullet points or lists
- Keep the writing simple, clear, and easy to read

Begin when ready.
`;
  }

  try {
    const result = await model.generateContent(prompt);
    const answer = result.response.text().trim();

    return {
      answer,
      companyName: data.companyName,
      question: data.question,
    };
  } catch (error) {
    console.error("Error generating answer:", error?.message || error);
    throw new Error("Failed to generate answer");
  }
}
