import { getDashboardData } from "@/backend/features/dashboard/actions";
import { getAssessments } from "@/backend/features/quiz/actions"; // Reusing this for the chart
import { getUserOnboardingStatus } from "@/backend/features/user/actions";
import { redirect } from "next/navigation";
import PerformanceChart from "./_components/performance-chart";
import RecentApplications from "./_components/recent-applications";
import DashboardGreeting from "./_components/dashboard-greeting";
import DashboardShortcuts from "./_components/dashboard-shortcuts";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const [dashboardData, assessments] = await Promise.all([
    getDashboardData(),
    getAssessments(),
  ]);

  const { stats, recentApplications } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Top Section: Greeting & Quick Actions (Asymmetrical Split) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Greeting & Stats (Dominant - 8 cols) */}
        <div className="md:col-span-12 lg:col-span-7 animate-fade-in-up">
          <DashboardGreeting stats={stats} />
        </div>

        {/* Right: Shortcuts (Supplementary - 4 cols) */}
        <div
          className="md:col-span-12 lg:col-span-5 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <DashboardShortcuts />
        </div>
      </div>

      {/* Bottom Section: Charts & Applications (Asymmetrical Split) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Performance Chart (Large - 8 cols) */}
        <div
          className="md:col-span-12 lg:col-span-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <PerformanceChart assessments={assessments} />
        </div>

        {/* Right: Recent Applications (Sidebar - 4 cols) */}
        <div
          className="md:col-span-12 lg:col-span-4 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <RecentApplications applications={recentApplications} />
        </div>
      </div>
    </div>
  );
}
