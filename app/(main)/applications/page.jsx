import { getApplications } from "@/actions/application";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApplicationsList from "./_components/applications-list";

export default async function ApplicationsPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    status: params?.status,
    source: params?.source,
    priority: params?.priority,
    dateFrom: params?.dateFrom,
    dateTo: params?.dateTo,
  };

  const applications = await getApplications(filters);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Job Applications</h1>
        <Link href="/applications/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </Link>
      </div>

      <ApplicationsList applications={applications} />
    </div>
  );
}

