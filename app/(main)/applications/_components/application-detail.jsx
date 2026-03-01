"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import MDEditor from "@uiw/react-md-editor";
import {
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Calendar,
  Briefcase,
} from "lucide-react";
import { updateApplicationStatus } from "@/actions/application";
import { getResume } from "@/actions/resume";
import { statusColors, formatJobType, statusDotColors } from "./constants";
import StatusChangeSelector from "./status-change-selector";

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
      if (
        application.resumeSourceType === "INTERNAL" &&
        application.resumeReference
      ) {
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
      {/* Application Summary & Status */}
      <div className="glass-card p-6 md:p-8 rounded-xl border-l-4 border-l-primary relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4" /> Current Status
              </Label>
              <div className="flex items-center gap-2">
                <StatusChangeSelector
                  status={status}
                  onStatusChange={handleStatusChange}
                  size="md"
                  className="w-full md:w-[180px]"
                  loading={isSavingStatus}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" /> Date Applied
              </Label>
              <div className="text-lg font-medium font-heading">
                {application.appliedAt
                  ? format(new Date(application.appliedAt), "MMM dd, yyyy")
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4" /> Job Type
              </Label>
              <div className="text-lg font-medium font-heading">
                {application.jobType
                  ? formatJobType(application.jobType)
                  : "N/A"}
              </div>
            </div>

            {application.jobLink && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Job Link
                </Label>
                <a
                  href={application.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 hover:underline flex items-center gap-2 transition-colors w-fit group/link"
                >
                  <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                  Open Job Posting
                </a>
              </div>
            )}
            {application.nextAction && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Next Action
                </Label>
                <div className="glass-card px-4 py-3 text-sm border-l-2 border-primary inline-flex items-center gap-2 bg-primary/5">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  {application.nextAction}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold font-heading mb-6 flex items-center gap-2">
              Status Timeline
            </h3>
            {application.statusHistory &&
            application.statusHistory.length > 0 ? (
              <div className="flex flex-col gap-0">
                {" "}
                {/* No gap between rows, padding handles it */}
                {[...application.statusHistory]
                  .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                  .map((history, index) => {
                    const bgColor =
                      statusDotColors[history.newStatus] || "bg-primary";
                    const isLast =
                      index === application.statusHistory.length - 1;

                    return (
                      <div
                        key={history.id}
                        className="flex gap-4 pb-8 last:pb-0 group"
                      >
                        {/* Timeline Track */}
                        <div className="flex flex-col items-center relative">
                          {/* Node - Simple Colored Circle */}
                          <div
                            className={`h-4 w-4 rounded-full ${bgColor} z-10 ${index === 0 ? `animate-pulse ring-4 ring-${bgColor.replace("bg-", "")}/20` : ""}`}
                          />

                          {/* Connecting Line - Only if not last item */}
                          {!isLast && (
                            <div className="absolute top-4 bottom-[-32px] w-0.5 bg-white/10" />
                          )}
                        </div>
                        <div className="flex flex-col gap-2 flex-1 -mt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="font-bold text-sm text-foreground">
                              {history.newStatus}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {format(
                                new Date(history.changedAt),
                                "MMM dd, h:mm a",
                              )}
                            </span>
                          </div>
                          {history.note && (
                            <div className="glass-card p-3 rounded-lg border border-white/5 text-sm text-muted-foreground mt-1 relative group-hover:border-white/10 transition-colors bg-white/5">
                              <p>{history.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-muted-foreground opacity-50" />
                </div>
                <p className="text-muted-foreground text-sm italic">
                  No history available.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Attachments Section */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 md:p-8 rounded-xl h-full flex flex-col">
            <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Attachments
            </h3>

            <div className="flex-1">
              {application.resumeSourceType ? (
                <div className="space-y-4 h-full">
                  {application.resumeSourceType === "INTERNAL" &&
                    resumeContent && (
                      <div className="glass-card p-4 rounded-lg border-white/10 h-[500px] overflow-y-auto scrollbar-hide">
                        <MDEditor.Markdown
                          source={resumeContent}
                          style={{
                            background: "transparent",
                            color: "inherit",
                          }}
                        />
                      </div>
                    )}
                  {application.resumeSourceType === "EXTERNAL_LINK" && (
                    <div className="glass-card p-6 flex flex-col items-center justify-center gap-4 text-center h-[200px]">
                      <LinkIcon className="h-12 w-12 text-primary/50" />
                      <div>
                        <p className="text-muted-foreground mb-2">
                          Resume is hosted externally
                        </p>
                        <a
                          href={application.resumeReference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View External Resume
                        </a>
                      </div>
                    </div>
                  )}
                  {application.resumeSourceType === "TEXT_PASTE" && (
                    <div className="glass-card p-6 rounded-lg border-white/10 max-h-[500px] overflow-y-auto scrollbar-hide font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {application.resumeReference}
                    </div>
                  )}
                  {application.resumeSourceType === "FILE_UPLOAD" &&
                    application.resumePdfPath && (
                      <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5 h-[600px] flex flex-col">
                        <object
                          data={application.resumePdfPath}
                          type="application/pdf"
                          className="w-full flex-1"
                          aria-label="Resume PDF"
                        >
                          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">
                              PDF preview not available.
                            </p>
                            <a
                              href={application.resumePdfPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Download to view
                            </a>
                          </div>
                        </object>
                      </div>
                    )}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border border-dashed border-white/20 rounded-xl bg-white/5">
                  <p className="text-muted-foreground">
                    No resume attached to this application.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
