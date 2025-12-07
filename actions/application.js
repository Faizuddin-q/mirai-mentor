"use server";

import { db } from "@/lib/prisma";
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
      jobLocation: data.jobLocation || null,
      jobType: data.jobType,
      jobLink: data.jobLink || null,
      source: data.source,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: data.status || "WISHLIST",
      priority: data.priority || "MEDIUM",
      nextAction: data.nextAction || null,
      notes: data.notes || null,
      resumeSourceType: data.resumeSourceType || null,
      resumeReference: data.resumeReference || null,
      coverLetterSourceType: data.coverLetterSourceType || null,
      coverLetterReference: data.coverLetterReference || null,
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
      jobLocation: data.jobLocation || null,
      jobType: data.jobType,
      jobLink: data.jobLink || null,
      source: data.source,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: data.status,
      priority: data.priority,
      nextAction: data.nextAction || null,
      notes: data.notes || null,
      resumeSourceType: data.resumeSourceType || null,
      resumeReference: data.resumeReference || null,
      coverLetterSourceType: data.coverLetterSourceType || null,
      coverLetterReference: data.coverLetterReference || null,
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
      ...(filters.source && { source: filters.source }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.dateFrom && {
        appliedAt: {
          gte: new Date(filters.dateFrom),
        },
      }),
      ...(filters.dateTo && {
        appliedAt: {
          lte: new Date(filters.dateTo),
        },
      }),
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

export async function addNoteToApplication(id, note) {
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
      notes: note,
    },
  });

  revalidatePath(`/applications/${id}`);
  return updated;
}

