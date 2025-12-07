"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Copy, Check, Sparkles, Edit, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAnswer, enhanceAnswer } from "@/actions/smart-answer-desk";
import useFetch from "@/hooks/use-fetch";
import { smartAnswerDeskSchema } from "@/app/lib/schema";
import MDEditor from "@uiw/react-md-editor";

const SmartAnswerDesk = () => {
  const [answerData, setAnswerData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [editorContent, setEditorContent] = useState("");
  const [editorMode, setEditorMode] = useState("preview");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(smartAnswerDeskSchema),
  });

  const {
    loading: generating,
    fn: generateAnswerFn,
    data: generatedAnswer,
  } = useFetch(generateAnswer);

  const {
    loading: isEnhancing,
    fn: enhanceAnswerFn,
    data: enhancedResult,
    error: enhanceError,
  } = useFetch(enhanceAnswer);

  useEffect(() => {
    if (generatedAnswer) {
      setAnswerData(generatedAnswer);
      setEditorContent(generatedAnswer.answer);
    }
  }, [generatedAnswer]);

  useEffect(() => {
    if (enhancedResult && !isEnhancing) {
      setEditorContent(enhancedResult.answer);
      setAnswerData((prev) => ({
        ...prev,
        answer: enhancedResult.answer,
      }));
      toast.success("Answer enhanced successfully!");
    }
    if (enhanceError) {
      toast.error(enhanceError.message || "Failed to enhance answer");
    }
  }, [enhancedResult, enhanceError, isEnhancing]);

  const onSubmit = async (data) => {
    try {
      setFormData(data);
      await generateAnswerFn(data);
      toast.success("Answer generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate answer");
    }
  };

  const handleCopy = async () => {
    if (!editorContent) return;
    
    try {
      await navigator.clipboard.writeText(editorContent);
      setCopied(true);
      toast.success("Answer copied to clipboard!");
      
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy answer");
    }
  };

  const handleEnhance = async () => {
    if (!answerData) {
      toast.error("No answer to enhance");
      return;
    }
    if (!editorContent || !editorContent.trim()) {
      toast.error("Please add some content to enhance");
      return;
    }
    try {
      await enhanceAnswerFn({
        currentAnswer: editorContent,
        companyName: answerData.companyName,
        question: answerData.question,
        companyJD: formData?.companyJD || "",
      });
    } catch (error) {
      console.error("Enhance error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Answer Desk</CardTitle>
          <CardDescription>
            Enter the company details and the question they asked you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <p className="text-sm text-red-500">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyJD">
                Company JD or Description (Optional)
              </Label>
              <Textarea
                id="companyJD"
                placeholder="Paste the company job description or company information here (optional)"
                className="h-32"
                {...register("companyJD")}
              />
              {errors.companyJD && (
                <p className="text-sm text-red-500">
                  {errors.companyJD.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">
                Question Asked by Company <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="question"
                placeholder="Enter the question asked by the company"
                className="h-32"
                {...register("question")}
              />
              {errors.question && (
                <p className="text-sm text-red-500">
                  {errors.question.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Answer...
                  </>
                ) : (
                  "Generate Answer"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {answerData && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Answer</CardTitle>
            <CardDescription>
              Answer for {answerData.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Question:</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {answerData.question}
                </p>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2">
                    {activeTab === "edit" && (
                      <Button
                        onClick={handleEnhance}
                        disabled={isEnhancing || !editorContent?.trim()}
                        variant="outline"
                        className="gap-2"
                      >
                        {isEnhancing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Enhance Answer
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleCopy}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <TabsContent value="edit">
                  <div className="space-y-2">
                    {activeTab === "edit" && (
                      <Button
                        variant="link"
                        type="button"
                        className="mb-2"
                        onClick={() =>
                          setEditorMode(editorMode === "preview" ? "edit" : "preview")
                        }
                      >
                        {editorMode === "preview" ? (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Mode
                          </>
                        ) : (
                          <>
                            <Monitor className="h-4 w-4 mr-2" />
                            Preview Mode
                          </>
                        )}
                      </Button>
                    )}
                    <div className="border rounded-lg">
                      <MDEditor
                        value={editorContent}
                        onChange={setEditorContent}
                        preview={editorMode}
                        height={500}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="border rounded-lg p-4">
                    <MDEditor.Markdown source={editorContent} />
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    setAnswerData(null);
                    setFormData(null);
                    setEditorContent("");
                    setActiveTab("preview");
                  }}
                >
                  Generate New Answer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SmartAnswerDesk;