import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { getApplication } from "@/backend/features/applications/actions";
import ApplicationForm from "../../_components/application-form";

export default async function EditApplicationPage({ params }) {
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

  const initialData = {
    ...application,
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2 mb-6">
        <Link href={`/applications/${id}`}>
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Application
          </Button>
        </Link>

        <h1 className="text-xl font-bold gradient-title mb-6">
          Edit Application for {application.companyName} - {application.jobTitle}
        </h1>
      </div>

      <ApplicationForm initialData={initialData} applicationId={id} />
    </div>
  );
}

