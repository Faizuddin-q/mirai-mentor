"use server";

import { db } from "@/backend/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createApplication(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const application = await db.application.create({
    data: {
      userId: user.id,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobType: data.jobType,
      jobLink: data.jobLink || null,
      status: data.status || "WISHLIST",
      nextAction: data.nextAction || null,
      appliedAt: data.appliedAt || null,
      resumeSourceType: data.resumeSourceType || null,
      resumeReference: data.resumeReference || null,
      resumePdfPath: data.resumePdfPath || null,
    },
  });

  // Create initial status history entry
  await db.applicationStatusHistory.create({
    data: {
      applicationId: application.id,
      oldStatus: null,
      newStatus: application.status,
      note: "Application created",
    },
  });

  revalidatePath("/applications");
  return application;
}

export async function updateApplication(id, data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const application = await db.application.findUnique({
    where: { id },
  });

  if (!application || application.userId !== user.id) {
    throw new Error("Application not found");
  }

  const updated = await db.application.update({
    where: { id },
    data: {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobType: data.jobType,
      jobLink: data.jobLink || null,
      status: data.status,
      nextAction: data.nextAction || null,
      appliedAt: data.appliedAt || null,
      resumeSourceType: data.resumeSourceType || null,
      resumeReference: data.resumeReference || null,
      resumePdfPath: data.resumePdfPath || null,
    },
  });

  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  return updated;
}

export async function deleteApplication(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const application = await db.application.findUnique({
    where: { id },
  });

  if (!application || application.userId !== user.id) {
    throw new Error("Application not found");
  }

  // Delete file from UploadThing if it exists
  if (application.resumePdfPath) {
    try {
      const { UTApi } = await import("uploadthing/server");
      const utapi = new UTApi();

      // UploadThing URLs format: https://utfs.io/f/{fileKey} or https://uploadthing.com/f/{fileKey}
      const urlParts = application.resumePdfPath.split("/");
      const fileKey = urlParts[urlParts.length - 1];

      if (fileKey) {
        await utapi.deleteFiles(fileKey);
      }
    } catch (error) {
      console.error("Error deleting file from UploadThing:", error);
    }
  }

  await db.application.delete({
    where: { id },
  });

  revalidatePath("/applications");
  return { success: true };
}

export async function updateApplicationStatus(id, status, note) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const application = await db.application.findUnique({
    where: { id },
  });

  if (!application || application.userId !== user.id) {
    throw new Error("Application not found");
  }

  const oldStatus = application.status;

  // Update application status
  const updated = await db.application.update({
    where: { id },
    data: { status },
  });

  // Create status history entry
  await db.applicationStatusHistory.create({
    data: {
      applicationId: id,
      oldStatus,
      newStatus: status,
      note: note || null,
    },
  });

  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  return updated;
}

export async function getApplications(filters = {}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const where = {
      userId: user.id,
      ...(filters.status && { status: filters.status }),
    };

    const applications = await db.application.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        statusHistory: {
          orderBy: {
            changedAt: "desc",
          },
          take: 1,
        },
      },
    });

    return applications;
  } catch (error) {
    // If the Application model doesn't exist yet, return empty array
    if (error.message?.includes("Unknown model") || error.message?.includes("application")) {
      console.warn("Application model not found. Please run: npx prisma generate && npx prisma migrate dev");
      return [];
    }
    throw error;
  }
}

export async function getApplication(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const application = await db.application.findUnique({
    where: { id },
    include: {
      statusHistory: {
        orderBy: {
          changedAt: "asc",
        },
      },
    },
  });

  if (!application || application.userId !== user.id) {
    throw new Error("Application not found");
  }

  return application;
}


export async function parseJobDetails(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!content || typeof content !== "string") {
    throw new Error("Invalid input content");
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert job application parser. Analyze the following job description or job link content and extract the following information in JSON format:
      - companyName: The name of the company.
      - jobTitle: The title of the job.
      - jobType: Determine the type based on the content: If the job title includes "intern", use "INTERN". If the content specifies "remote", use "REMOTE". If the content specifies "hybrid", use "HYBRID". Otherwise, default to "FULL_TIME". The allowed values are "FULL_TIME", "INTERN", "REMOTE", "HYBRID", "CONTRACT".
      - jobLink: If a link is present in the text, extract it.
      - status: Default to "WISHLIST".
      - nextAction: Suggest a next action (e.g., "Review job description", "Prepare resume").
      - appliedAt: null.
      - resumeSourceType: "NONE".
      - resumeReference: null.
      
      Input content:
      "${content}"
      
      Return ONLY the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("AI Raw Response:", text);

    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(cleanedText);
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError);
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error parsing job details:", error);
    // Return a more user-friendly error message
    if (error.message.includes("Invalid response format")) {
      throw error;
    }
    throw new Error("Failed to parse job details. Please try again or fill the form manually.");
  }
}

export async function getApplicationStats() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const stats = await db.application.aggregate({
    where: { userId: user.id },
    _count: {
      _all: true, // Total applications
    },
  });

  const interviewCount = await db.application.count({
    where: {
      userId: user.id,
      status: "INTERVIEW",
    },
  });

  // Calculate momentum: Number of applications created in the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const momentum = await db.application.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  return {
    total: stats._count._all,
    interviews: interviewCount,
    momentum,
  };
}
