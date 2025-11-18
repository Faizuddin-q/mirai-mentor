"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateAIInsights = async (industry, userData = null) => {
  // Parse industry to get main industry and sub-industry
  let industryName = industry || "";
  let subIndustry = "";
  if (industry) {
    const parts = industry.split("-");
    industryName = parts[0] || "";
    subIndustry = parts.slice(1).join(" ").replace(/-/g, " ") || "";
  }

  // Build user context if available
  let userContext = "";
  if (userData) {
    const experienceLevel = userData.experience 
      ? userData.experience === 0 
        ? "entry-level" 
        : userData.experience < 3 
          ? "junior" 
          : userData.experience < 7 
            ? "mid-level" 
            : userData.experience < 12 
              ? "senior" 
              : "executive/leadership"
      : "professional";

    const skillsList = userData.skills && userData.skills.length > 0 
      ? userData.skills.join(", ") 
      : "general professional skills";

    userContext = `

## 👤 Target Professional Profile:
- **Experience Level:** ${experienceLevel} (${userData.experience || 0} years of experience)
- **Current Skills:** ${skillsList}
- **Professional Background:** ${userData.bio || "Experienced professional in the industry"}

**Note:** While generating insights, consider this professional's experience level and current skills to provide relevant salary ranges, skill recommendations, and career growth opportunities that align with their profile.`;
  }

  const prompt = `
          You are a senior labor market intelligence analyst with over 15 years of experience in economic forecasting, workforce analytics, salary benchmarking, and hiring trend analysis. You work as part of an international think tank producing labor reports for governments and Fortune 500 firms. You combine deep quantitative research, macro‑economic signals, micro‑level job data, and skill demand insights to deliver actionable intelligence.

Your task is to produce a **deep, research‑backed, highly structured analysis** of the **${industryName}${subIndustry ? ` - ${subIndustry}` : ""}** industry in India.${userContext ? userContext : ""} This output will be stored in a production database and parsed programmatically, so it must adhere exactly to the JSON schema described below. No extra commentary or markdown is allowed. Treat this as if you are preparing an internal labor market briefing to be read by government economists, HR leaders, and workforce development experts.

---

## 🎯 Mission
Provide a comprehensive 2024–2025 snapshot of the ${industryName}${subIndustry ? ` - ${subIndustry}` : ""} industry in India${userData ? `, with insights tailored for ${userData.experience || 0} years of experience professionals` : ""}, combining:
- Salary intelligence across multiple roles and seniorities${userData ? ` (with emphasis on roles appropriate for ${userData.experience || 0} years experience)` : ""}
- Current and projected growth trends
- Hiring demand intensity
- Most in‑demand technical and domain skills${userData && userData.skills?.length ? ` (considering current skills: ${userData.skills.join(", ")})` : ""}
- Market sentiment and investment outlook
- Emerging trends shaping the sector
- Skills professionals should develop to remain competitive over the next 3–5 years${userData ? ` (personalized recommendations based on their current skill set and experience level)` : ""}

---

## 📦 Strict JSON Schema (Must Follow Exactly)

Return only a valid JSON object in this format:

{
  "salaryRanges": [
    {
      "role": "string",              // distinct job title in the ${industryName}${subIndustry ? ` - ${subIndustry}` : ""} sector (entry, mid, senior, or niche)
      "min": number,                 // minimum annual salary in INR (no commas, symbols, or text)
      "max": number,                 // maximum annual salary in INR
      "median": number,              // median annual salary in INR
      "location": "string"           // e.g. "India", "Remote", or a major Indian city such as "Bangalore"
    }
  ],
  "growthRate": number,             // realistic projected growth % (e.g. 6.5)
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["string", "string", "string", "string", "string+"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["string", "string", "string", "string", "string+"],
  "recommendedSkills": ["string", "string", "string", "string", "string+"]
}

---

## 🧠 Field‑Level Guidance

### salaryRanges
- Include at least **10 distinct roles** (entry, mid, senior, niche, or emerging) reflecting real hiring patterns in ${industryName}${subIndustry ? `, specifically ${subIndustry}` : ""}.
${userData ? `- **Priority:** Include roles relevant to a ${userData.experience === 0 ? "entry-level" : userData.experience < 3 ? "junior" : userData.experience < 7 ? "mid-level" : userData.experience < 12 ? "senior" : "executive/leadership"} professional with ${userData.experience || 0} years of experience.` : ""}
- For tech industry, MUST include diverse roles like: Frontend Developer, Backend Developer, Full Stack Developer, DevOps Engineer, QA Engineer, UI/UX Designer, Product Manager, Data Engineer, Mobile App Developer, Cloud Architect, Cybersecurity Specialist, AI/ML Engineer, Site Reliability Engineer, Technical Lead, etc.
- Salaries must be **realistic Indian market figures for 2024–2025** in INR as plain numbers.
- Cover a spectrum of roles (technical, managerial, specialist)${userData ? `, with emphasis on roles matching the professional's experience level` : ""}.

### growthRate
- Reflect a credible YoY growth rate derived from signals like hiring velocity, capital investment, and government policy impact.

### demandLevel
- Use “High” for sectors with aggressive hiring/open roles.
- “Medium” for stable but selective hiring.
- “Low” for shrinking/stagnant hiring.

### topSkills
- At least 10 **current, ATS‑friendly skills** critical for the ${industryName}${subIndustry ? ` - ${subIndustry}` : ""} domain.
${userData && userData.skills?.length ? `- **Context:** The professional already has skills in: ${userData.skills.join(", ")}. Include complementary skills that build upon their existing expertise.` : ""}
- Mix hard/technical and domain‑specific competencies (e.g. "Cloud Security" rather than "Computer Skills").

### marketOutlook
- Reflect the sentiment for the next 12–18 months (“Positive”, “Neutral”, “Negative”).

### keyTrends
- At least 10 **non‑generic, industry‑specific trends**, such as technology adoption, regulatory changes, capital flows, new business models, remote work, sustainability, AI integration, etc.

### recommendedSkills
- At least 10 **emerging or future‑ready skills** professionals should acquire to remain competitive.
${userData ? `- **Personalization:** Recommend skills that are appropriate for a ${userData.experience === 0 ? "entry-level" : userData.experience < 3 ? "junior" : userData.experience < 7 ? "mid-level" : userData.experience < 12 ? "senior" : "executive/leadership"} professional (${userData.experience || 0} years experience)${userData.skills?.length ? `, building upon their current skills: ${userData.skills.join(", ")}` : ""}.` : ""}
- Can overlap with topSkills but should skew toward next‑generation capabilities.
- Focus on skills that align with career progression for their experience level.

---

## 🔒 Output Constraints

- **Return only the JSON object** — no commentary, no markdown, no code fences.
- All numeric fields must be valid JSON numbers (no quotes, no “₹”, no “k”, no commas, no text).
- All arrays must contain at least 10 entries.
- Do not repeat the same role/skill/trend unnecessarily.
- Ensure realistic Indian market data (use your training, but no external citations or disclaimers).
- Response must be parseable with JSON.parse() with no modifications.

---

## ✅ Example (Shortened)

{
  "salaryRanges": [
    {
      "role": "Data Analyst",
      "min": 400000,
      "max": 950000,
      "median": 650000,
      "location": "Bangalore"
    },
    …
  ],
  "growthRate": 6.5,
  "demandLevel": "High",
  "topSkills": ["Cloud Security", "Data Engineering", "Generative AI", "DevOps", "Data Visualization"],
  "marketOutlook": "Positive",
  "keyTrends": ["AI Adoption", "Remote Work", "Government Incentives", "Green Tech Investments", "Skill Shortages"],
  "recommendedSkills": ["Prompt Engineering", "Cybersecurity", "Product Analytics", "Leadership in Tech", "Change Management"]
}

---

Your output will be parsed by an automated system. **Return only the complete JSON object described above. Nothing else. Begin now.**

  `;
  

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry, {
      experience: user.experience,
      skills: user.skills,
      bio: user.bio,
    });

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}

// Manual trigger to update insights immediately
export async function refreshIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {    
    // Force generate new insights with current time
    const insights = await generateAIInsights(user.industry, {
      experience: user.experience,
      skills: user.skills,
      bio: user.bio,
    });
    
    const updatedInsight = await db.industryInsight.upsert({
      where: { industry: user.industry },
      update: {
        ...insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 2 * 60 * 1000),
      },
      create: {
        industry: user.industry,
        ...insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 2 * 60 * 1000),
      },
    });

    return updatedInsight;
  } catch (error) {
    console.error("Error refreshing insights:", error);
    throw new Error("Failed to refresh insights");
  }
}

// Fix incomplete industry data and regenerate insights
export async function fixIndustryData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {    
    // Check if industry field is incomplete
    if (user.industry && user.industry.endsWith('-')) {      
      // For now, let's set it to a complete tech industry
      const completeIndustry = user.industry + 'software-development';
      
      // Update user's industry
      await db.user.update({
        where: { clerkUserId: userId },
        data: { industry: completeIndustry },
      });
      
      // Delete old incomplete industry insight
      await db.industryInsight.deleteMany({
        where: { industry: user.industry },
      });
      
      // Generate new insights with complete industry
      const insights = await generateAIInsights(completeIndustry, {
        experience: user.experience,
        skills: user.skills,
        bio: user.bio,
      });
      
      const newInsight = await db.industryInsight.create({
        data: {
          industry: completeIndustry,
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 2 * 60 * 1000),
        },
      });
      return newInsight;
    }
    
    // If industry is complete, just refresh insights
    return await refreshIndustryInsights();
    
  } catch (error) {
    console.error("Error fixing industry data:", error);
    throw new Error("Failed to fix industry data");
  }
}
