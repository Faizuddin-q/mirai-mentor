"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MDEditor from "@uiw/react-md-editor";
import {
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { updateApplicationStatus } from "@/actions/application";
import Link from "next/link";
import { getResume } from "@/actions/resume";

const statusColors = {
  WISHLIST: "bg-gray-500",
  APPLIED: "bg-blue-500",
  OA: "bg-purple-500",
  INTERVIEW: "bg-yellow-500",
  OFFER: "bg-green-500",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-gray-400",
};

export default function ApplicationDetail({ application }) {
  const router = useRouter();
  const [status, setStatus] = useState(application.status);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [resumeContent, setResumeContent] = useState(null);

  const handleStatusChange = async (newStatus) => {
    setIsSavingStatus(true);
    try {
      await updateApplicationStatus(application.id, newStatus);
      setStatus(newStatus);
      toast.success("Status updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsSavingStatus(false);
    }
  };


  // Load resume content if it's an internal reference
  useEffect(() => {
    const loadAttachments = async () => {
      if (application.resumeSourceType === "INTERNAL" && application.resumeReference) {
        try {
          const resume = await getResume(application.resumeReference);
          setResumeContent(resume?.content);
        } catch (error) {
          console.error("Error loading resume:", error);
        }
      }
    };
    loadAttachments();
  }, [application]);

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {application.companyName} - {application.jobTitle}
              </CardTitle>
              <CardDescription className="mt-2">
                {application.jobType}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <div className="mt-1 flex items-center gap-2">
                <Select
                  value={status}
                  onValueChange={handleStatusChange}
                  disabled={isSavingStatus}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WISHLIST">Wishlist</SelectItem>
                    <SelectItem value="APPLIED">Applied</SelectItem>
                    <SelectItem value="OA">OA</SelectItem>
                    <SelectItem value="INTERVIEW">Interview</SelectItem>
                    <SelectItem value="OFFER">Offer</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
                {isSavingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </div>

            {application.jobLink && (
              <div>
                <Label className="text-sm text-muted-foreground">Job Link</Label>
                <div className="mt-1">
                  <a
                    href={application.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Job Posting
                  </a>
                </div>
              </div>
            )}

            {application.nextAction && (
              <div>
                <Label className="text-sm text-muted-foreground">Next Action</Label>
                <div className="mt-1">{application.nextAction}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      {application.statusHistory && application.statusHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
            <CardDescription>Track the progression of this application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.statusHistory.map((history, index) => (
                <div key={history.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    {index < application.statusHistory.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[history.newStatus]}>
                        {history.newStatus}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(history.changedAt), "MMM dd, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    {history.note && (
                      <p className="text-sm text-muted-foreground mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
          <CardDescription>Resume used for this application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {application.resumeSourceType && (
            <div>
              <Label className="text-sm font-semibold mb-2 block">Resume</Label>
              {application.resumeSourceType === "INTERNAL" && resumeContent && (
                <div className="border rounded-lg p-4">
                  <MDEditor.Markdown source={resumeContent} />
                </div>
              )}
              {application.resumeSourceType === "EXTERNAL_LINK" && (
                <a
                  href={application.resumeReference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  {application.resumeReference}
                </a>
              )}
              {application.resumeSourceType === "TEXT_PASTE" && (
                <div className="border rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{application.resumeReference}</p>
                </div>
              )}
              {application.resumeSourceType === "FILE_UPLOAD" && application.resumePdfPath && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="w-full h-[600px] bg-gray-50">
                    <object
                      data={application.resumePdfPath}
                      type="application/pdf"
                      className="w-full h-full"
                      aria-label="Resume PDF"
                    >
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">
                          Your browser doesn't support PDF preview.
                        </p>
                        <a
                          href={application.resumePdfPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Open PDF in new tab
                        </a>
                      </div>
                    </object>
                  </div>
                  <div className="p-2 bg-muted border-t flex items-center justify-between">
                    <a
                      href={application.resumePdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      Open PDF in new tab
                    </a>
                    <a
                      href={application.resumePdfPath}
                      download
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      Download PDF
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {!application.resumeSourceType && (
            <p className="text-sm text-muted-foreground">No attachments added yet.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

