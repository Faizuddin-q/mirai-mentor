import { getDashboardData } from "@/actions/dashboard";
import { getAssessments } from "@/actions/interview"; // Reusing this for the chart
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import StatsCards from "./_components/stats-cards";
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
    <div className="mx-auto space-y-4 py-8">
      <DashboardGreeting stats={stats} />
      <DashboardShortcuts />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col space-y-6">
          <PerformanceChart assessments={assessments} />
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col space-y-6">
          <RecentApplications applications={recentApplications} />
        </div>
      </div>
    </div>
  );
}
