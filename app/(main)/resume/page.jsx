import { getResumes } from "@/actions/resume";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeList from "./_components/resume-list";

export default async function ResumePage() {
  const resumes = await getResumes();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Resumes</h1>
        <Link href="/resume/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <ResumeList resumes={resumes} />
    </div>
  );
}
