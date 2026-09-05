"use client";

import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Copy, Check, Save, Sparkles, Loader2, Edit, Monitor } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { toast } from "sonner";
import { saveCoverLetter, enhanceCoverLetter } from "@/backend/features/cover-letter/actions";
import useFetch from "@/frontend/hooks/use-fetch";

const CoverLetterPreview = ({ content, coverLetterId }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [editorContent, setEditorContent] = useState(content || "");
  const [editorMode, setEditorMode] = useState("preview");

  // Update editor content when content prop changes
  useEffect(() => {
    if (content) {
      setEditorContent(content);
    }
  }, [content]);

  const {
    loading: isSaving,
    fn: saveCoverLetterFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveCoverLetter);

  const {
    loading: isEnhancing,
    fn: enhanceCoverLetterFn,
    data: enhancedResult,
    error: enhanceError,
  } = useFetch(enhanceCoverLetter);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Cover letter saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save cover letter");
    }
  }, [saveResult, saveError, isSaving]);

  // Handle enhance result
  useEffect(() => {
    if (enhancedResult && !isEnhancing) {
      setEditorContent(enhancedResult.content);
      toast.success("Cover letter enhanced successfully!");
    }
    if (enhanceError) {
      toast.error(enhanceError.message || "Failed to enhance cover letter");
    }
  }, [enhancedResult, enhanceError, isEnhancing]);

  const handleCopy = async () => {
    try {
      // Copy the markdown content to clipboard
      await navigator.clipboard.writeText(editorContent || "");
      setCopied(true);
      toast.success("Cover letter copied to clipboard!");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy cover letter");
    }
  };

  const handleSave = async () => {
    if (!coverLetterId) {
      toast.error("Cover letter ID is missing");
      return;
    }
    try {
      await saveCoverLetterFn(coverLetterId, editorContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleEnhance = async () => {
    if (!coverLetterId) {
      toast.error("Cover letter ID is missing");
      return;
    }
    if (!editorContent || !editorContent.trim()) {
      toast.error("Please add some content to enhance");
      return;
    }
    try {
      await enhanceCoverLetterFn(coverLetterId, editorContent);
    } catch (error) {
      console.error("Enhance error:", error);
    }
  };

  return (
    <div className="py-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {activeTab === "edit" && (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  variant="default"
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
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
                      Enhance Cover Letter
                    </>
                  )}
                </Button>
              </>
            )}
            <Button
              onClick={handleCopy}
              variant="outline"
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
            <MDEditor
              value={editorContent}
              onChange={setEditorContent}
              preview={editorMode}
              height={700}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <MDEditor value={editorContent} preview="preview" height={700} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoverLetterPreview;
