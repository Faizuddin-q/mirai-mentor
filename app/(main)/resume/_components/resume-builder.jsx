"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/frontend/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Input } from "@/frontend/components/ui/input";
import { improveWithAI, saveResume } from "@/backend/features/resume/actions";
import { EntryForm } from "./entry-form";
import useFetch from "@/frontend/hooks/use-fetch";
import { useUser } from "@/frontend/contexts/user-context";
import { entriesToMarkdown, parseMarkdownToFormData } from "@/backend/features/resume/helper";
import { resumeSchema } from "@/backend/features/resume/schema";
import { pdf } from "@react-pdf/renderer";
import ResumePDFDocument from "./resume-pdf-document";

export default function ResumeBuilder({ initialContent, resumeId }) {
  console.log({ resumeId });
  console.log({ initialContent });
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [contactErrors, setContactErrors] = useState({
    email: "",
    mobile: "",
  });
  const [contactTouched, setContactTouched] = useState({
    email: false,
    mobile: false,
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const {
    loading: isImprovingSummary,
    fn: improveSummaryFn,
    data: improvedSummary,
    error: improveSummaryError,
  } = useFetch(improveWithAI);

  const emailRegister = register("contactInfo.email");
  const mobileRegister = register("contactInfo.mobile");

  // Watch form fields for preview updates
  const formValues = watch();

  // Parse initial content and populate form when component mounts or initialContent changes
  useEffect(() => {
    if (initialContent && initialContent.trim()) {
      const parsedData = parseMarkdownToFormData(initialContent);
      if (parsedData) {
        // Reset form with parsed data
        reset(parsedData);
        // Set preview content to initial content
        setPreviewContent(initialContent);
        setActiveTab("preview");
      }
    }
  }, [initialContent, reset]);

  // Update preview content when form values change (in edit mode)
  useEffect(() => {
    if (activeTab === "edit") {
      const { summary, skills, experience, education, projects } = formValues;
      const { contactInfo } = formValues;
      const contactParts = [];
      if (contactInfo?.email) contactParts.push(`${contactInfo.email}`);
      if (contactInfo?.mobile) contactParts.push(`${contactInfo.mobile}`);
      if (contactInfo?.linkedin) contactParts.push(`[LinkedIn](${contactInfo.linkedin})`);
      if (contactInfo?.github) contactParts.push(`[GitHub](${contactInfo.github})`);

      const contactMarkdown = contactParts.length > 0
        ? `<div align="center">\n\n# ${user?.name || 'Your Name'}\n\n${contactParts.join(" | ")}\n\n</div>\n\n`
        : "";

      const newContent = [
        contactMarkdown,
        summary && `## PROFESSIONAL SUMMARY\n\n${summary}`,
        skills && `## TECHNICAL SKILLS\n\n${skills}`,
        entriesToMarkdown(experience, "EXPERIENCE"),
        entriesToMarkdown(education, "EDUCATION"),
        entriesToMarkdown(projects, "PERSONAL PROJECTS"),
      ]
        .filter(Boolean)
        .join("\n\n");
      setPreviewContent(newContent || initialContent || "");
    }
  }, [formValues, activeTab, initialContent, user, entriesToMarkdown]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  useEffect(() => {
    if (improvedSummary && !isImprovingSummary) {
      setValue("summary", improvedSummary);
      toast.success("Summary improved successfully!");
    }
    if (improveSummaryError) {
      toast.error(improveSummaryError.message || "Failed to improve summary");
    }
  }, [improvedSummary, improveSummaryError, isImprovingSummary, setValue]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Helper function to normalize Indian phone numbers
  const normalizeIndianPhone = (phone) => {
    if (!phone) return null;
    // Remove spaces, dashes, parentheses, and country code
    const cleaned = phone.replace(/[\s()-]/g, '').replace(/^\+91/, '').replace(/^91/, '');
    return cleaned;
  };

  // Indian phone number regex: 10 digits starting with 6, 7, 8, or 9
  const indianPhoneRegex = /^[6-9]\d{9}$/;

  const runContactValidation = (field, value, markTouched = false) => {
    if (markTouched) {
      setContactTouched((prev) => ({ ...prev, [field]: true }));
    }

    let message = "";
    if (field === "email") {
      if (!value) {
        message = "Email is required";
      } else if (!emailRegex.test(value)) {
        message = "Invalid email address";
      }
    } else if (field === "mobile") {
      if (value) {
        const normalized = normalizeIndianPhone(value);
        if (!normalized || !indianPhoneRegex.test(normalized)) {
          message = "Enter a valid 10-digit mobile number";
        }
      }
    }

    setContactErrors((prev) => ({ ...prev, [field]: message }));

    if (message) {
      setError(`contactInfo.${field}`, { type: "manual", message });
    } else {
      clearErrors(`contactInfo.${field}`);
    }
  };

  const handleContactChange = (field) => (event) => {
    const value = event.target.value;
    runContactValidation(field, value, true);
  };

  const handleContactBlur = (field) => (event) => {
    runContactValidation(field, event.target.value, true);
  };

  const handleImproveSection = async (section) => {
      if (section === "summary") {
        const summaryText = watch("summary");
        if (!summaryText) {
          toast.error("Please enter a summary first");
          return;
        }

        await improveSummaryFn({
          current: summaryText,
          type: "summary",
        });
      }
    };


    const getContactMarkdown = () => {
      const { contactInfo } = formValues;
      const parts = [];
      if (contactInfo.email) parts.push(`${contactInfo.email}`);
      if (contactInfo.mobile) parts.push(`${contactInfo.mobile}`);
      if (contactInfo.linkedin)
        parts.push(`[LinkedIn](${contactInfo.linkedin})`);
      if (contactInfo.github) parts.push(`[GitHub](${contactInfo.github})`);

      return parts.length > 0
        ? `<div align="center">\n\n# ${user?.name || 'Your Name'}\n\n${parts.join(" | ")}\n\n</div>`
        : "";
    };

    const getCombinedContent = () => {
      const { summary, skills, experience, education, projects } = formValues;
      return [
        getContactMarkdown(),
        summary && `## PROFESSIONAL SUMMARY\n\n${summary}`,
        skills && `## TECHNICAL SKILLS\n\n${skills}`,
        entriesToMarkdown(experience, "EXPERIENCE"),
        entriesToMarkdown(education, "EDUCATION"),
        entriesToMarkdown(projects, "PERSONAL PROJECTS"),
      ]
        .filter(Boolean)
        .join("\n\n");
    };

    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
      setIsGenerating(true);
      try {
        let filename = "resume.pdf";
        if (user?.name) {
          const username = user.name.toLowerCase().replace(/\s+/g, "_");
          filename = `${username}_resume.pdf`;
        }

        const blob = await pdf(
          <ResumePDFDocument
            name={user?.name}
            contactInfo={formValues.contactInfo}
            summary={formValues.summary}
            skills={formValues.skills}
            experience={formValues.experience}
            education={formValues.education}
            projects={formValues.projects}
          />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("PDF generation error:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    const onSubmit = async (data) => {
      if (!resumeId) {
        toast.error("Resume ID is missing. Please create a new resume.");
        return;
      }

      try {
        // Normalize phone number before saving if present
        if (formValues.contactInfo?.mobile) {
          const normalizedPhone = normalizeIndianPhone(formValues.contactInfo.mobile);
          if (normalizedPhone && indianPhoneRegex.test(normalizedPhone)) {
            setValue("contactInfo.mobile", normalizedPhone);
          }
        }

        const formattedContent = previewContent
          .replace(/\n/g, "\n") // Normalize newlines
          .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
          .trim();
        await saveResumeFn(resumeId, previewContent);
      } catch (error) {
        console.error("Save error:", error);
      }
    };

    return (
      <div data-color-mode="light" className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <h1 className="font-bold gradient-title text-5xl md:text-6xl">
            Resume Builder
          </h1>
          <div className="space-x-2">
            <Button
              variant="success"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button onClick={generatePDF} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="edit">Form</TabsTrigger>
            <TabsTrigger value="preview">Markdown</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...emailRegister}
                      type="email"
                      placeholder="your@email.com"
                      onChange={(event) => {
                        emailRegister.onChange(event);
                        handleContactChange("email")(event);
                      }}
                      onBlur={(event) => {
                        emailRegister.onBlur(event);
                        handleContactBlur("email")(event);
                      }}
                    />
                    {contactTouched.email && contactErrors.email && (
                      <p className="text-sm text-red-500">{contactErrors.email}</p>
                    )}
                    {!contactErrors.email && errors.contactInfo?.email && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mobile Number</label>
                    <Input
                      {...mobileRegister}
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      onChange={(event) => {
                        // Only allow digits and normalize input
                        let value = event.target.value.replace(/\D/g, '');
                        // Limit to 10 digits
                        value = value.slice(0, 10);
                        // Update the input value
                        event.target.value = value;
                        mobileRegister.onChange(event);
                        handleContactChange("mobile")(event);
                      }}
                      onBlur={(event) => {
                        mobileRegister.onBlur(event);
                        handleContactBlur("mobile")(event);
                      }}
                    />
                    {contactTouched.mobile && contactErrors.mobile && (
                      <p className="text-sm text-red-500">{contactErrors.mobile}</p>
                    )}
                    {!contactErrors.mobile && errors.contactInfo?.mobile && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.mobile.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <Input
                      {...register("contactInfo.linkedin")}
                      type="url"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                    {errors.contactInfo?.linkedin && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.linkedin.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      GitHub Profile
                    </label>
                    <Input
                      {...register("contactInfo.github")}
                      type="url"
                      placeholder="https://github.com/your-username"
                    />
                    {errors.contactInfo?.github && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.github.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Professional Summary</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveSection("summary")}
                    disabled={isImprovingSummary}
                  >
                    {isImprovingSummary ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Improving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Improve with AI
                      </>
                    )}
                  </Button>
                </div>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="h-32"
                      placeholder="Write a compelling professional summary..."
                      error={errors.summary}
                    />
                  )}
                />
                {errors.summary && (
                  <p className="text-sm text-red-500">{errors.summary.message}</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Skills</h3>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="h-32"
                      placeholder="List your key skills..."
                      error={errors.skills}
                    />
                  )}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills.message}</p>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Work Experience</h3>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Experience"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Education</h3>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Education"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.education && (
                  <p className="text-sm text-red-500">
                    {errors.education.message}
                  </p>
                )}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Projects</h3>
                <Controller
                  name="projects"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Project"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.projects && (
                  <p className="text-sm text-red-500">
                    {errors.projects.message}
                  </p>
                )}
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview">
            {activeTab === "preview" && (
              <Button
                variant="link"
                type="button"
                className="mb-2"
                onClick={() =>
                  setResumeMode(resumeMode === "preview" ? "edit" : "preview")
                }
              >
                {resumeMode === "preview" ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Resume
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4" />
                    Show Preview
                  </>
                )}
              </Button>
            )}

            {activeTab === "preview" && resumeMode !== "preview" && (
              <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">
                  You will lose editied markdown if you update the form data.
                </span>
              </div>
            )}
            <div className="border rounded-lg">
              <MDEditor
                value={previewContent}
                onChange={setPreviewContent}
                height={800}
                preview={resumeMode}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
}
