"use client";

import { Card, CardContent } from "@/frontend/components/ui/card";
import {
  FileText,
  PenBox,
  GraduationCap,
  Brain,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const shortcuts = [
  {
    name: "Resume Builder",
    description: "Create a professional resume tailored.",
    href: "/resume",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
  },
  {
    name: "Cover Letter",
    description: "Generate a personalized cover letter in seconds.",
    href: "/ai-cover-letter",
    icon: PenBox,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50",
  },
  {
    name: "Mock Interview",
    description: "Practice with AI-driven questions for your role.",
    href: "/quiz",
    icon: GraduationCap,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "group-hover:border-green-500/50",
  },
  {
    name: "Smart Answer",
    description: "Get answers for job application questions.",
    href: "/smart-answer-desk",
    icon: Brain,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500/50",
  },
];

export default function DashboardShortcuts() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {shortcuts.map((shortcut) => (
          <Link
            href={shortcut.href}
            key={shortcut.name}
            className="block group"
          >
            <div
              className={`glass-card p-4 rounded-xl h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden ${shortcut.border}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full w-fit shrink-0 ${shortcut.bg} ${shortcut.color} group-hover:scale-110 transition-transform`}
                >
                  <shortcut.icon className="h-6 w-6" />
                </div>

                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {shortcut.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {shortcut.description}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3 right-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
