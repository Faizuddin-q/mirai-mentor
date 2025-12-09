import { getApplications, getApplicationStats } from "@/actions/application";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Job Applications Tracker</h1>
        <div className="flex gap-2">
          <QuickAddDialog />
          <Link href="/applications/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </Link>
        </div>
      </div>

      <StatsCards stats={stats} />

      <ApplicationsList applications={applications} />
    </div>
  );
}

