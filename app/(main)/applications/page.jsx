import { getApplications, getApplicationStats } from "@/backend/features/applications/actions";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import ApplicationsList from "./_components/applications-list";
import StatsCards from "./_components/stats-cards";

import QuickAddDialog from "./_components/quick-add-dialog";

export default async function ApplicationsPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    status: params?.status,
    dateFrom: params?.dateFrom,
    dateTo: params?.dateTo,
  };

  const [applications, stats] = await Promise.all([
    getApplications(filters),
    getApplicationStats(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-heading gradient-title">
          Job Applications
        </h1>
        <div className="flex gap-3">
          <QuickAddDialog />
          <Link href="/applications/new">
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <StatsCards stats={stats} />
        <ApplicationsList applications={applications} />
      </div>
    </div>
  );
}
