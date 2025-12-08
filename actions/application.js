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
      jobType: data.jobType,
      jobLink: data.jobLink || null,
      status: data.status || "WISHLIST",
      nextAction: data.nextAction || null,
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

