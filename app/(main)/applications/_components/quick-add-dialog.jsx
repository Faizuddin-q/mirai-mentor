"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import ApplicationForm from "./application-form";
import { parseJobDetails } from "@/actions/application";
import { toast } from "sonner";

export default function QuickAddDialog() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Form
    const [input, setInput] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);

    const handleParse = async () => {
        if (!input.trim()) return;

        setIsParsing(true);
        try {
            const data = await parseJobDetails(input);
            data.status = "APPLIED";
            data.appliedAt = new Date().toISOString();
            setParsedData(data);
            setStep(2);
        } catch (error) {
            toast.error("Failed to parse job details. Please try again.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setStep(1);
        setInput("");
        setParsedData(null);
    };

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            handleClose();
        } else {
            setOpen(isOpen);
        }
    };

    return (
        <Dialog 
            open={open} 
            onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2 border border-border">
                    <Sparkles className="h-4 w-4" />
                    Quick Add
                </Button>
            </DialogTrigger>
            <DialogContent 
                className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Quick Add Application</DialogTitle>
                </DialogHeader>

                {step === 1 ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Paste a job description or link below. AI will extract the details for you. (Paste both for better handling)
                            </p>
                            <Textarea
                                placeholder="Paste job description or link here..."
                                className="min-h-[200px]"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleParse} disabled={!input.trim() || isParsing}>
                                {isParsing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Parsing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Parse with AI
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <ApplicationForm
                        initialData={parsedData}
                        onCancel={handleClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
