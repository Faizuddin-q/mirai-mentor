"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, FileText, X, CheckCircle2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { applicationSchema } from "@/app/lib/schema";
import { createApplication, updateApplication } from "@/actions/application";
import useFetch from "@/hooks/use-fetch";
import { getResumes } from "@/actions/resume";
import { generateUploadButton } from "@uploadthing/react";

const UploadButton = generateUploadButton();

export default function ApplicationForm({ initialData, applicationId }) {
  const router = useRouter();
  const isEditing = !!applicationId;
  const [resumeSourceType, setResumeSourceType] = useState("NONE");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [appliedDate, setAppliedDate] = useState(null);

  const {
    loading: creating,
    fn: createApplicationFn,
    data: createdApplication,
  } = useFetch(createApplication);

  const {
    loading: updating,
    fn: updateApplicationFn,
    data: updatedApplication,
  } = useFetch(updateApplication);

  useEffect(() => {
    // Load resumes for internal reference
    const loadData = async () => {
      try {
        const resumesData = await getResumes();
        setResumes(resumesData || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (createdApplication) {
      toast.success("Application created successfully!");
      router.push("/applications");
      router.refresh();
    }
  }, [createdApplication, router]);

  useEffect(() => {
    if (updatedApplication) {
      toast.success("Application updated successfully!");
      router.push("/applications");
      router.refresh();
    }
  }, [updatedApplication, router]);

  useEffect(() => {
    if (initialData) {
      setResumeSourceType(initialData.resumeSourceType || "NONE");
      if (initialData.resumeSourceType === "TEXT_PASTE") {
        setResumeText(initialData.resumeReference || "");
      }
      if (initialData.resumeSourceType === "FILE_UPLOAD" && initialData.resumePdfPath) {
        setResumeFile(initialData.resumePdfPath);
        // extract filename from URL if available
        const urlParts = initialData.resumePdfPath.split("/");
        const fileName = urlParts[urlParts.length - 1] || "resume.pdf";
        setResumeFileName(fileName);
      }
      if (initialData.appliedAt) {
        setAppliedDate(new Date(initialData.appliedAt));
      }
    }
  }, [initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: initialData ? {
      ...initialData,
      resumeReference: initialData.resumeReference || "none",
    } : {
      status: "WISHLIST",
      jobType: "FULL_TIME",
      resumeReference: "none",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Handle resume reference based on source type
      let resumeRef = null;
      let resumePdfPath = null;
      
      if (resumeSourceType === "NONE") {
        // Explicitly no resume - set everything to null
        resumeRef = null;
        resumePdfPath = null;
      } else if (resumeSourceType === "INTERNAL" && data.resumeReference && data.resumeReference !== "none") {
        resumeRef = data.resumeReference;
      } else if (resumeSourceType === "FILE_UPLOAD" && resumeFile) {
        resumePdfPath = resumeFile;
      } else if (resumeSourceType === "EXTERNAL_LINK") {
        const resumeLink = watch("resumeLink");
        if (resumeLink) resumeRef = resumeLink;
      } else if (resumeSourceType === "TEXT_PASTE" && resumeText) {
        resumeRef = resumeText;
      }

      // Handle applied date - combine selected date with current time
      let appliedAtDateTime = null;
      if (appliedDate) {
        const now = new Date();
        appliedAtDateTime = new Date(appliedDate);
        appliedAtDateTime.setHours(now.getHours());
        appliedAtDateTime.setMinutes(now.getMinutes());
        appliedAtDateTime.setSeconds(now.getSeconds());
        appliedAtDateTime.setMilliseconds(now.getMilliseconds());
      }

      const applicationData = {
        ...data,
        // Transform "NONE" to null, or set to null if no resume data provided
        resumeSourceType: (resumeSourceType === "NONE" || !(resumeRef || resumePdfPath)) ? null : resumeSourceType,
        resumeReference: resumeRef,
        resumePdfPath: resumePdfPath,
        appliedAt: appliedAtDateTime,
      };

      if (isEditing) {
        await updateApplicationFn(applicationId, applicationData);
      } else {
        await createApplicationFn(applicationData);
      }
    } catch (error) {
      toast.error(error.message || "Failed to save application");
    }
  };

  const handleRemoveResume = async () => {
    if (resumeFile) {
      try {
        const response = await fetch("/api/uploadthing/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileUrl: resumeFile }),
        });

        if (!response.ok) {
          console.error("Failed to delete file from UploadThing");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    // Clear local state
    setResumeFile(null);
    setResumeFileName(null);
    setUploadingFile(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the job details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder="Enter job title"
                {...register("jobTitle")}
              />
              {errors.jobTitle && (
                <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">
                Job Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("jobType")}
                onValueChange={(value) => setValue("jobType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="INTERN">Intern</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                </SelectContent>
              </Select>
              {errors.jobType && (
                <p className="text-sm text-red-500">{errors.jobType.message}</p>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="jobLink">Job Link <span className="text-gray-500">(optional)</span></Label>
              <Input
                id="jobLink"
                type="url"
                placeholder="https://..."
                {...register("jobLink")}
              />
              {errors.jobLink && (
                <p className="text-sm text-red-500">{errors.jobLink.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date Applied <span className="text-gray-500">(optional)</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !appliedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appliedDate ? format(appliedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-6" align="start">
                  <Calendar
                    selected={appliedDate}
                    onSelect={setAppliedDate}
                    className="rounded-md "
                  />
                </PopoverContent>
              </Popover>
              {errors.appliedAt && (
                <p className="text-sm text-red-500">{errors.appliedAt.message}</p>
              )}
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="nextAction">Next Action <span className="text-gray-500">(optional)</span></Label>
            <Input
              id="nextAction"
              placeholder="e.g., Follow up in 3 days"
              {...register("nextAction")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
          <CardDescription>Attach the resume used for this application <span className="text-gray-500">(optional)</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Resume Source <span className="text-gray-500">(optional)</span></Label>
            <Select value={resumeSourceType} onValueChange={setResumeSourceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">No Resume</SelectItem>
                <SelectItem value="INTERNAL">From My Resumes</SelectItem>
                <SelectItem value="FILE_UPLOAD">Upload PDF</SelectItem>
                <SelectItem value="EXTERNAL_LINK">External Link</SelectItem>
                <SelectItem value="TEXT_PASTE">Paste Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {resumeSourceType === "NONE" && (
            <p className="text-sm text-muted-foreground">No resume will be attached to this application.</p>
          )}

          {resumeSourceType === "INTERNAL" && (
            <div className="space-y-2">
              <Label htmlFor="resumeReference">Select Resume</Label>
              <Select
                value={watch("resumeReference") || "none"}
                onValueChange={(value) => setValue("resumeReference", value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a resume (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>
                      {resume.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {resumeSourceType === "EXTERNAL_LINK" && (
            <div className="space-y-2">
              <Label htmlFor="resumeLink">Resume Link</Label>
              <Input
                id="resumeLink"
                type="url"
                placeholder="https://..."
                {...register("resumeLink", { required: false })}
              />
            </div>
          )}

          {resumeSourceType === "FILE_UPLOAD" && (
            <div className="space-y-3">
              <Label>Upload Resume PDF (Max 1MB)</Label>
              
              {/* Upload Area - Show only when no file is uploaded */}
              {!resumeFile && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 bg-muted/30">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative w-full flex justify-center">
                        <div className="[&_button]:!block [&_button]:!inline-flex border-2 border border-muted-foreground/25 rounded-lg px-4 bg-muted/30 hover:bg-orange-500 hover:text-white">
                          <UploadButton
                            endpoint="resumeUploader"
                            onClientUploadComplete={(res) => {
                              if (res && res[0]) {
                                setResumeFile(res[0].url);
                                setResumeFileName(res[0].name || "resume.pdf");
                                setUploadingFile(false);
                                toast.success("Resume uploaded successfully");
                              }
                            }}
                            onUploadError={(error) => {
                              setUploadingFile(false);
                              toast.error(`Upload failed: ${error.message}`);
                            }}
                            onUploadBegin={(name) => {
                              setUploadingFile(true);
                              setResumeFileName(name || "resume.pdf");
                            }}
                            className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-primary/50 ut-allowed-content:hidden"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Select a PDF file to upload (max 1MB)
                      </p>
                    </div>
                  </div>
                  
                  {uploadingFile && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Uploading...</p>
                        {resumeFileName && (
                          <p className="text-xs text-muted-foreground truncate">
                            {resumeFileName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Success State - Show only when file is uploaded */}
              {resumeFile && !uploadingFile && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          Resume uploaded successfully
                        </p>
                      </div>
                      {resumeFileName && (
                        <p className="text-xs text-green-700 dark:text-green-300 truncate">
                          {resumeFileName}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={handleRemoveResume}
                    >
                      <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {resumeSourceType === "TEXT_PASTE" && (
            <div className="space-y-2">
              <Label htmlFor="resumeText">Paste Resume Content</Label>
              <Textarea
                id="resumeText"
                placeholder="Paste your resume content here..."
                className="h-32"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={creating || updating}>
          {(creating || updating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Application" : "Create Application"}
        </Button>
      </div>
    </form>
  );
}

