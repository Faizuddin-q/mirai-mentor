"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateQuiz(questionCount = 10) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const count = Math.max(1, Math.min(50, parseInt(questionCount) || 10));

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
      experience: true,
      bio: true,
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

  const bioContext = user.bio 
    ? `\n  - **Professional Background:** ${user.bio.substring(0, 150)}${user.bio.length > 150 ? "..." : ""}`
    : "";

  const prompt = `
  You are a senior technical interviewer and assessment designer with expertise in creating level-appropriate interview questions.
  
  Your task is to generate **${count} high-quality multiple-choice technical interview questions** for a **${experienceLevel}** professional in the **${industry}${subIndustry ? ` - ${subIndustry}` : ""}** industry${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
  
  ---
  
  ## 👤 Candidate Profile:
  - **Experience Level:** ${experienceLevel} (${user.experience || 0} years of experience)
  - **Industry:** ${industry}${subIndustry ? ` - ${subIndustry}` : ""}
  - **Key Skills:** ${skillsList}${bioContext}
  
  ---
  
  ## 🧠 Question Design Guidelines:
  - Each question must assess **real-world knowledge** relevant to the candidate's ${experienceLevel} level and their skills: ${skillsList}
  - Questions should be **appropriately challenging** for someone with ${user.experience || 0} years of experience in ${industry}${subIndustry ? `, specifically ${subIndustry}` : ""}
  - Each question must have **exactly 4 options**, with **only one correct answer**
  - Avoid overly basic questions (unless candidate is entry-level) or questions too advanced for their experience level
  - Ensure options are plausible (i.e., good distractors)
  - Focus on practical, industry-relevant scenarios in ${industry}${subIndustry ? ` and ${subIndustry}` : ""}
  - Provide a short but clear **explanation** for the correct answer that helps the candidate learn
  
  ---
  
  ## 🔄 Format:
  Return ONLY a valid JSON object using this exact structure:
  
  {
    "questions": [
      {
        "question": "string",                            // The question text
        "options": ["string", "string", "string", "string"], // 4 choices
        "correctAnswer": "string",                       // Must match one of the options
        "explanation": "string"                          // Reason why the answer is correct
      }
      // ${count - 1} more like this (total of ${count} questions)
    ]
  }
  
  ---
  
  ## 🚫 Rules:
  - Do **not** include any markdown, comments, headers, or explanation outside of the JSON
  - Output must be **only the JSON object**, nothing else
  - Ensure all strings are plain text (no code formatting)
  - Questions should reflect ${experienceLevel} level complexity and ${industry}${subIndustry ? ` ${subIndustry}` : ""} industry standards
  
  Begin.
  `;
  

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      industry: true,
      skills: true,
      experience: true,
      bio: true,
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

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      You are a career coach providing personalized feedback to a ${experienceLevel} professional (${user.experience || 0} years of experience) in the ${industry}${subIndustry ? ` - ${subIndustry}` : ""} industry with skills in: ${skillsList}.

      The candidate got the following technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes and the candidate's profile (${experienceLevel} level, ${user.experience || 0} years experience, skills: ${skillsList}), provide a concise, specific, and personalized improvement tip.
      - Focus on the knowledge gaps revealed by these wrong answers
      - Consider their experience level (${experienceLevel}) and suggest appropriate learning resources
      - Reference their industry (${industry}${subIndustry ? `, specifically ${subIndustry}` : ""}) and relevant skills (${skillsList})
      - Keep the response under 2-3 sentences and make it encouraging
      - Don't explicitly mention the mistakes, instead focus on what to learn/practice that aligns with their career level
      - Make it actionable and specific to their ${experienceLevel} level in ${industry}
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
