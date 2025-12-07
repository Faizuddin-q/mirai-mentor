"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Copy, Check } from "lucide-react";
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
import { generateAnswer } from "@/actions/smart-answer-desk";
import useFetch from "@/hooks/use-fetch";
import { smartAnswerDeskSchema } from "@/app/lib/schema";
import MDEditor from "@uiw/react-md-editor";

const SmartAnswerDesk = () => {
  const [answerData, setAnswerData] = useState(null);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (generatedAnswer) {
      setAnswerData(generatedAnswer);
    }
  }, [generatedAnswer]);

  const onSubmit = async (data) => {
    try {
      await generateAnswerFn(data);
      toast.success("Answer generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate answer");
    }
  };

  const handleCopy = async () => {
    if (!answerData?.answer) return;
    
    try {
      await navigator.clipboard.writeText(answerData.answer);
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
              <div>
                <Label className="text-sm font-semibold mb-2 block">Answer:</Label>
                <div className="border rounded-lg p-4">
                  <MDEditor.Markdown source={answerData.answer} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
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
                      Copy Answer
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    setAnswerData(null);
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