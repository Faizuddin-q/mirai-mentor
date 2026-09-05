import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { getApplication } from "@/backend/features/applications/actions";
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
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
        <div className="flex flex-col space-y-2">
          <Link href="/applications">
            <Button
              variant="link"
              className="gap-2 pl-0 hover:text-primary transition-colors text-muted-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Applications
            </Button>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold gradient-title tracking-tight leading-tight">
            {application.jobTitle}
          </h1>
          <p className="text-xl text-muted-foreground font-light flex items-center gap-2">
            at{" "}
            <span className="text-foreground font-semibold">
              {application.companyName}
            </span>
          </p>
        </div>
        <Link href={`/applications/${application.id}/edit`}>
          <Button className="gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/50 transition-all shadow-[0_0_15px_rgba(255,165,0,0.1)] hover:shadow-[0_0_25px_rgba(255,165,0,0.2)]">
            <Edit className="h-4 w-4 mr-2" />
            Edit Application
          </Button>
        </Link>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <ApplicationDetail application={application} />
      </div>
    </div>
  );
}
