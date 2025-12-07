"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applicationSchema } from "@/app/lib/schema";
import { createApplication, updateApplication } from "@/actions/application";
import useFetch from "@/hooks/use-fetch";
import { getResumes } from "@/actions/resume";

export default function ApplicationForm({ initialData, applicationId }) {
  const router = useRouter();
  const isEditing = !!applicationId;
  const [resumeSourceType, setResumeSourceType] = useState("INTERNAL");
  const [resumeText, setResumeText] = useState("");
  const [resumes, setResumes] = useState([]);

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
      router.push(`/applications/${createdApplication.id}`);
      router.refresh();
    }
  }, [createdApplication, router]);

  useEffect(() => {
    if (updatedApplication) {
      toast.success("Application updated successfully!");
      router.push(`/applications/${updatedApplication.id}`);
      router.refresh();
    }
  }, [updatedApplication, router]);

  useEffect(() => {
    if (initialData) {
      setResumeSourceType(initialData.resumeSourceType || "INTERNAL");
      if (initialData.resumeSourceType === "TEXT_PASTE") {
        setResumeText(initialData.resumeReference || "");
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
      priority: "MEDIUM",
      jobType: "FULL_TIME",
      source: "LINKEDIN",
      resumeReference: "none",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Handle resume reference based on source type
      let resumeRef = null;
      if (resumeSourceType === "INTERNAL" && data.resumeReference && data.resumeReference !== "none") {
        resumeRef = data.resumeReference;
      } else if (resumeSourceType === "EXTERNAL_LINK") {
        const resumeLink = watch("resumeLink");
        if (resumeLink) resumeRef = resumeLink;
      } else if (resumeSourceType === "TEXT_PASTE" && resumeText) {
        resumeRef = resumeText;
      }

      const applicationData = {
        ...data,
        resumeSourceType: resumeRef ? resumeSourceType : null,
        resumeReference: resumeRef,
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
              <Label htmlFor="jobLink">Job Link</Label>
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
              <Label htmlFor="source">
                Source <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("source")}
                onValueChange={(value) => setValue("source", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                  <SelectItem value="COMPANY_SITE">Company Site</SelectItem>
                  <SelectItem value="REFERRAL">Referral</SelectItem>
                  <SelectItem value="PORTAL">Portal</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.source && (
                <p className="text-sm text-red-500">{errors.source.message}</p>
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
              <Label htmlFor="priority">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("priority")}
                onValueChange={(value) => setValue("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextAction">Next Action</Label>
            <Input
              id="nextAction"
              placeholder="e.g., Follow up in 3 days"
              {...register("nextAction")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this application..."
              className="h-32"
              {...register("notes")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
          <CardDescription>Attach the resume used for this application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Resume Source</Label>
            <Select value={resumeSourceType} onValueChange={setResumeSourceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNAL">From My Resumes</SelectItem>
                <SelectItem value="EXTERNAL_LINK">External Link</SelectItem>
                <SelectItem value="TEXT_PASTE">Paste Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

