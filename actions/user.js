"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    let industryInsight = await db.industryInsight.findUnique({
      where: { industry: data.industry },
    });

    if (!industryInsight) {
      const insights = await generateAIInsights(data.industry);

      try {
        industryInsight = await db.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
          },
        });
      } catch (createError) {
        // If another request created it in the meantime, fetch it again
        industryInsight = await db.industryInsight.findUnique({
          where: { industry: data.industry },
        });
      }
    }

    const updatedUserRecord = await db.user.update({
      where: { id: user.id },
      data: {
        industry: data.industry,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills,
      },
    });

    revalidatePath("/");

    const updatedUser = {
      ...updatedUserRecord,
      skills: updatedUserRecord.skills ?? [],
    };

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
        clerkUserId: true,
        email: true,
        name: true,
        imageUrl: true,
      },
    });

    if (!user) {
      const ensuredUser = await checkUser();
      if (!ensuredUser) {
        throw new Error("Unable to initialize user profile");
      }
      user = {
        industry: ensuredUser.industry,
        clerkUserId: ensuredUser.clerkUserId,
        email: ensuredUser.email,
        name: ensuredUser.name,
        imageUrl: ensuredUser.imageUrl,
      };
    }

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        industry: true,
        bio: true,
        experience: true,
        skills: true,
      },
    });

    if (!user) throw new Error("User not found");

    // Parse industry back to separate fields
    let industry = "";
    let subIndustry = "";
    if (user.industry) {
      const parts = user.industry.split("-");
      industry = parts[0] || "";
      const parsedSubIndustry = parts.slice(1).join(" ").replace(/-/g, " ") || "";
      
      // Import industries data to find exact match
      const { industries } = await import("@/data/industries");
      const industryData = industries.find((ind) => ind.id === industry);
      
      if (industryData && parsedSubIndustry) {
        // Find matching subIndustry with case-insensitive comparison
        const matchedSubIndustry = industryData.subIndustries.find(
          (sub) => sub.toLowerCase().replace(/\s+/g, " ") === parsedSubIndustry.toLowerCase().replace(/\s+/g, " ")
        );
        subIndustry = matchedSubIndustry || parsedSubIndustry;
      } else {
        subIndustry = parsedSubIndustry;
      }
    }

    return {
      ...user,
      industry,
      subIndustry,
      skills: user.skills ? user.skills.join(", ") : "",
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
}
