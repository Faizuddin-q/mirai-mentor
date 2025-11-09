import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateAIInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  try {
    // Combined query to get both user status and insights in one go
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });

    if (!user) redirect("/onboarding");

    // Check if user is onboarded
    if (!user.industry) {
      redirect("/onboarding");
    }

    // Get or generate insights
    let insights = user.industryInsight;
    if (!insights) {
      const generatedInsights = await generateAIInsights(user.industry);
      insights = await db.industryInsight.create({
        data: {
          industry: user.industry,
          ...generatedInsights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 2 * 60 * 1000),
        },
      });
    }

    return (
      <div>
        <DashboardView insights={insights} />
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    redirect("/onboarding");
  }
}
