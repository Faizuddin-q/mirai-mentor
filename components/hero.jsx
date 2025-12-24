"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import SectionBadge from "./ui/section-badge";

const HeroSection = () => {
  return (
    <section className="w-full pt-32 md:pt-40 pb-10">
      <div className="mx-auto flex flex-col items-center gap-8 px-10 text-center md:flex-row md:items-start md:text-left">
        <div className="flex-1 space-y-6">
          <SectionBadge icon={<Sparkles className="h-4 w-4" />} title="AI-Powered Career Assistant" />
          <div className="space-y-5">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl xl:text-7xl gradient-title animate-gradient">
              Build Your Career
              <br />
              with AI Guidance
            </h1>
            <p className="text-muted-foreground md:text-lg lg:text-xl">
              Get help with resumes, cover letters, interview practice, and
              market insights to support your career journey.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
            <Link href="/sign-in">
              <Button size="lg" className="w-full gap-2 px-8 md:w-auto">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 px-8 md:w-auto"
              >
                See How It Works
                <PlayCircle className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-3 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
              Build professional resumes with AI assistance
            </li>
            <li className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-3 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
              Practice interviews with AI-generated quiz
            </li>
            <li className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-3 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
              Generate personalized cover letters
            </li>
            <li className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-3 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
              Track your applications and progress
            </li>
          </ul>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className=" w-full mt-24  md:mt-0 animate-float">
            <div className="relative overflow-hidden rounded-2xl border shadow-2xl">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
              <Image
                src="/banner.png"
                width={1080}
                height={640}
                alt="Mirai Mentor dashboard preview highlighting career progress tracking"
                className="mx-auto rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
