"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteResume } from "@/actions/resume";

export default function ResumeList({ resumes }) {
  const router = useRouter();

  const handleDelete = async (id, title) => {
    try {
      await deleteResume(id);
      toast.success("Resume deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete resume");
    }
  };

  if (!resumes?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Resumes Yet</CardTitle>
          <CardDescription>
            Create your first resume to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <Card key={resume.id} className="group relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl gradient-title">
                  {resume.title}
                </CardTitle>
                <CardDescription>
                  Updated {format(new Date(resume.updatedAt), "PPP")}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(`/resume/${resume.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your resume "{resume.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(resume.id, resume.title)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">
              {resume.content ? (
                <div className="line-clamp-3">
                  {resume.content
                    .replace(/<[^>]*>/g, "") // Remove HTML tags
                    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove markdown links, keep text
                    .replace(/[#*`_~]/g, "") // Remove markdown formatting
                    .replace(/\n+/g, " ") // Replace newlines with spaces
                    .replace(/\s+/g, " ") // Replace multiple spaces with single space
                    .trim()
                    .substring(0, 150)}
                  {resume.content.length > 150 ? "..." : ""}
                </div>
              ) : (
                "Empty resume"
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

