import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getResume } from "@/actions/resume";
import ResumeBuilder from "../_components/resume-builder";

export default async function EditResumePage({ params }) {
  const { id } = await params;
  const resume = await getResume(id);

  if (!resume) {
    redirect("/resume");
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2 mb-6">
        <Link href="/resume">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Resumes
          </Button>
        </Link>

        <h1 className="text-xl font-bold gradient-title mb-6">
          {resume?.title}
        </h1>
      </div>

      <ResumeBuilder initialContent={resume?.content} resumeId={resume?.id} />
    </div>
  );
}

