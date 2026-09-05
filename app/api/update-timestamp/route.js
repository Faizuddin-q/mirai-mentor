import { NextResponse } from "next/server";
import { db } from "@/backend/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's industry
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    if (!user || !user.industry) {
      return NextResponse.json({ error: "User or industry not found" }, { status: 404 });
    }

    // Update the timestamp to current time
    const now = new Date();

    const updatedInsight = await db.industryInsight.update({
      where: { industry: user.industry },
      data: {
        lastUpdated: now,
        nextUpdate: new Date(now.getTime() + 2 * 60 * 1000), // 2 minutes from now
      },
    });

    return NextResponse.json({
      success: true,
      message: "Timestamp updated successfully",
      newTimestamp: updatedInsight.lastUpdated,
      industry: user.industry,
    });
  } catch (error) {
    console.error("Error updating timestamp:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
