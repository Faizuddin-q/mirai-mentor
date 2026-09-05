"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { createResume } from "@/backend/features/resume/actions";
import { toast } from "sonner";
import useFetch from "@/frontend/hooks/use-fetch";

export default function NewResumePage() {
  const router = useRouter();
  const [title, setTitle] = useState("My Resume");
  
  const {
    loading,
    fn: createResumeFn,
    data: resume,
    error: createError,
  } = useFetch(createResume);

  // Handle successful resume creation
  useEffect(() => {
    if (resume && !loading) {
      toast.success("Resume created successfully!");
      router.push(`/resume/${resume.id}`);
    }
  }, [resume, loading, router]);

  // Handle errors (useFetch already shows toast, but we can add additional handling)
  useEffect(() => {
    if (createError && !loading) {
      console.error("Error creating resume:", createError);
    }
  }, [createError, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createResumeFn(title || "My Resume");
    } catch (error) {
      // Error is already handled by useFetch hook which shows toast
      console.error("Error creating resume:", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/resume">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Resumes
          </Button>
        </Link>

        <div className="pb-6">
          <h1 className="text-6xl font-bold gradient-title">
            Create New Resume
          </h1>
          <p className="text-muted-foreground">
            Start building your professional resume
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Resume Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Software Engineer Resume"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Resume"
          )}
        </Button>
      </form>
    </div>
  );
}
