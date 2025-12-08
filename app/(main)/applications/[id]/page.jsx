import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApplication } from "@/actions/application";
import ApplicationDetail from "../_components/application-detail";

export default async function ApplicationDetailPage({ params }) {
  const { id } = await params;

  let application;
  try {
    application = await getApplication(id);
  } catch (error) {
    redirect("/applications");
  }

  if (!application) {
    redirect("/applications");
  }

  return (
    <div className="container mx-auto py-6 ">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col space-y-2">
          <Link href="/applications">
            <Button variant="link" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Applications
            </Button>
          </Link>

          <h1 className="text-xl font-bold gradient-title mb-6">
            {application.companyName} - {application.jobTitle}
          </h1>
        </div>
        <Link href={`/applications/${application.id}/edit`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4 mr-2" />
            Edit Application
          </Button>
        </Link>
      </div>

      <ApplicationDetail application={application} />
    </div>
  );
}

