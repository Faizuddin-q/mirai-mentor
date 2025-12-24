"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  PenBox,
  GraduationCap,
  Brain,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const shortcuts = [
  {
    name: "Resume Builder",
    description: "Create a professional resume tailored to your industry.",
    href: "/resume",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Cover Letter",
    description: "Generate a personalized cover letter in seconds.",
    href: "/ai-cover-letter",
    icon: PenBox,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    name: "Mock Interview",
    description: "Practice with AI-driven questions for your role.",
    href: "/quiz",
    icon: GraduationCap,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    name: "Smart Answer Desk",
    description: "Get perfect answers for job application questions.",
    href: "/smart-answer-desk",
    icon: Brain,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export default function DashboardShortcuts() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map((shortcut) => (
          <Link
            href={shortcut.href}
            key={shortcut.name}
            className="block group"
          >
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden border-muted-foreground/20">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-full w-fit ${shortcut.bg} ${shortcut.color} group-hover:scale-110 transition-transform`}
                  >
                    <shortcut.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                    {shortcut.name}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {shortcut.description}
                </p>

                <div className="flex items-center text-xs font-medium text-primary mt-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  Go to {shortcut.name} <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
