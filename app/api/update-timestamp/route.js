import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🕐 Manual timestamp update requested");

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
    console.log("Current time:", now.toISOString());
    
    const updatedInsight = await db.industryInsight.update({
      where: { industry: user.industry },
      data: {
        lastUpdated: now,
        nextUpdate: new Date(now.getTime() + 2 * 60 * 1000), // 2 minutes from now
      },
    });

    console.log("✅ Timestamp updated successfully");

    return NextResponse.json({
      success: true,
      message: "Timestamp updated successfully",
      newTimestamp: updatedInsight.lastUpdated,
      industry: user.industry,
    });
  } catch (error) {
    console.error("❌ Error updating timestamp:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
