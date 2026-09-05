import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import ApplicationForm from "../_components/application-form";

export default function NewApplicationPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2 mb-6">
        <Link href="/applications">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Button>
        </Link>

        <h1 className="text-xl font-bold gradient-title mb-6">
          Add New Application
        </h1>
      </div>

      <ApplicationForm />
    </div>
  );
}

