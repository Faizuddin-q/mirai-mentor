import { db } from "@/backend/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "*/2 * * * *" }, // Run every 2 minutes
  async ({ event, step }) => {    
    const industries = await step.run("Fetch industries", async () => {
      const result = await db.industryInsight.findMany({
        select: { industry: true },
      });
      return result;
    });

    if (industries.length === 0) {
      return;
    }

    for (const { industry } of industries) {
      const prompt = `
      You are acting as a senior labor market intelligence analyst with deep experience in workforce analytics, economic forecasting, and industry-specific hiring trends. Your role is to synthesize and present detailed, research-backed insights into the current state of the **${industry}** industry.
      
      ---
      
      ## 🎯 Objective
      
      Your task is to deliver comprehensive and up-to-date insights about the **${industry}** industry in India, intended for professionals, career strategists, and HR teams. These insights will be used to guide talent development, job market readiness, and strategic workforce planning.
      
      You must simulate a response that reflects actual 2024–2025 labor market behavior, based on known trends, hiring patterns, and skill demands. Base your analysis on expert knowledge as if informed by sources like Naukri, LinkedIn India Hiring Trends, IBEF, and global labor reports — but **do not reference** them directly.
      
      ---
      
      ## 📦 Required Output Format
      
      Return a single, **valid JSON object** using the exact structure and constraints below:
      
      {
        "salaryRanges": [
          {
            "role": "string",              // e.g. "Software Engineer"
            "min": number,                 // Minimum annual salary in INR (e.g. 450000)
            "max": number,                 // Maximum annual salary in INR (e.g. 1600000)
            "median": number,              // Median annual salary in INR (e.g. 950000)
            "location": "string"           // City, Region or "Remote" (e.g. "Bangalore", "India", "Remote")
          }
        ],
        "growthRate": number,             // Projected industry growth rate as a percentage (e.g. 6.5)
        "demandLevel": "High" | "Medium" | "Low",
        "topSkills": [
          "string",                       // e.g. "Cloud Architecture"
          "string",
          "string",
          "string",
          "string+"
        ],
        "marketOutlook": "Positive" | "Neutral" | "Negative",
        "keyTrends": [
          "string",                       // e.g. "Increased adoption of generative AI"
          "string",
          "string",
          "string",
          "string+"
        ],
        "recommendedSkills": [
          "string",                       // e.g. "Prompt Engineering"
          "string",
          "string",
          "string",
          "string+"
        ]
      }
      
      ---
      
      ## 📊 Field-Level Guidance
      
      ### 1. **salaryRanges**
      - Include **at least 10** diverse roles that are in demand in the ${industry} industry
      - For tech industry, MUST include: Frontend Developer, Backend Developer, Full Stack Developer, DevOps Engineer, QA Engineer, UI/UX Designer, Product Manager, Data Engineer, Mobile App Developer, Cloud Architect, Cybersecurity Specialist, AI/ML Engineer, Site Reliability Engineer, Technical Lead, Database Administrator, System Administrator, Network Engineer, etc.
      - Ensure salaries are realistic based on Indian market data (2024–2025)
      - Use INR values — do **not** add currency symbols or commas
      - Cover a range of roles (entry-level, mid-level, senior, niche)
      
      ### 2. **growthRate**
      - Projected YoY industry growth rate (e.g., 4.2)
      - Must be realistic, based on market demand and economic forecasts
      
      ### 3. **demandLevel**
      - Classify based on hiring activity and job postings
      - Use "High" if the industry is seeing aggressive hiring
      - Use "Medium" for steady but selective hiring
      - Use "Low" for stagnant or declining roles
      
      ### 4. **topSkills**
      - Must reflect current hiring requirements
      - Mix technical and soft skills when appropriate
      - Skills should be ATS-friendly (used in job descriptions)
      - For tech industry, include: React, Node.js, Python, Java, AWS, Docker, Kubernetes, Git, SQL, JavaScript, TypeScript, etc.
      
      ### 5. **marketOutlook**
      - Overall sentiment of the industry over the next 6–12 months
      - "Positive" if growing, "Neutral" if stable, "Negative" if shrinking
      
      ### 6. **keyTrends**
      - Industry-specific trends: technology shifts, regulatory changes, investment patterns, remote/hybrid adoption, etc.
      - Must include at least 10 trends that are **specific**, not generic
      - For tech industry, include: AI/ML adoption, cloud migration, remote work, cybersecurity threats, low-code platforms, edge computing, etc.
      
      ### 7. **recommendedSkills**
      - Emerging or high-leverage skills that professionals should develop to stay competitive
      - May overlap with topSkills, but should lean toward **future-ready** capabilities
      - For tech industry, include: AI/ML, cloud certifications, DevOps, blockchain, cybersecurity, data science, etc.
      
      ---
      
      ## 🔒 Output Constraints
      
      - You must return **only the JSON object**, without:
        - Markdown formatting
        - Code fences (like \`\`\`json)
        - Additional explanations or commentary
      - Ensure the JSON is syntactically valid and clean — suitable for "JSON.parse()"
      - All numbers must be numeric (no strings or suffixes like "k" or "INR")
      - All arrays must have **at least 10** entries
      - For salaryRanges, include exactly 12-15 diverse tech roles
      - For topSkills, include exactly 12-15 current tech skills
      - For keyTrends, include exactly 12-15 industry trends
      - For recommendedSkills, include exactly 12-15 future skills
      
      ---
      
      ## ✅ Additional Requirements
      
      - Ensure all content is aligned with current Indian market realities (2024–2025)
      - Avoid vague or generic skills like "communication" unless specifically critical in the industry
      - Use accurate terminology consistent with job postings in this sector
      - Avoid repeating the same skill/trend/role in different sections
      - CRITICAL: Generate fresh, diverse data every time - do not repeat the same 6 generic roles
      - Ensure role names are specific and varied (Frontend Developer, Backend Developer, DevOps Engineer, etc.)
      
      ---
      
      Your response will be parsed and stored by a backend service. **Only return the JSON object. Nothing else.** Begin.
      `;
      
      

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      const text = res.response.candidates[0].content.parts[0].text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run(`Update ${industry} insights`, async () => {
        try {
          const result = await db.industryInsight.update({
            where: { industry },
            data: {
              ...insights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
            },
          });
          return result;
        } catch (error) {
          console.error(`Error updating insights for ${industry}:`, error);
          throw error;
        }
      });
    }
    
  }
);
