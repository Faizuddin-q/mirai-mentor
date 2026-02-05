"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles, Trophy, Target } from "lucide-react";
import SectionBadge from "./ui/section-badge";

const HeroSection = () => {
  return (
    <section className="w-full pt-32 pb-20 relative overflow-hidden">
      <div className="mx-auto container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column: Typography & CTAs */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <SectionBadge
              icon={<Sparkles className="h-4 w-4" />}
              title="AI-Powered Career Assistant"
            />
            <div className="space-y-6">
              <h1 className="text-5xl font-black md:text-6xl lg:text-7xl xl:text-8xl tracking-tighter leading-[1.1] md:leading-[1.1]">
                Details Matter.
                <br />
                <span className="gradient-title text-glow">
                  Career Defying.
                </span>
              </h1>
              <p className="text-muted-foreground md:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 text-balance font-light">
                Escape the generic. Build a resume and career path that screams{" "}
                <span className="text-foreground font-semibold">premium</span>{" "}
                with our AI-powered architect.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/sign-in">
                <Button
                  size="xl"
                  className="btn-primary h-14 px-8 text-lg rounded-full group"
                >
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  size="xl"
                  className="h-14 px-8 text-lg rounded-full border-primary/20 text-foreground hover:bg-primary/10 hover:border-primary/50"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </Link>
            </div>

          </div>

          {/* Right Column: 3D Dashboard */}
          <div className="flex-1 w-full relative perspective-1000">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />

            <div className="hero-image relative z-10 transform-gpu transition-all duration-500 hover:scale-[1.02] hover:rotate-x-12 hover:rotate-y-12">
              <div className="glass-card p-2 rounded-2xl border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-primary/20">
                <Image
                  src="/banner.png"
                  width={1280}
                  height={720}
                  alt="Mirai Mentor Dashboard"
                  className="rounded-xl border border-white/5"
                  priority
                />
                {/* Floating Elements on top of image */}
                <div
                  className="absolute -left-12 top-20 glass-card p-4 rounded-xl border-white/10 animate-float hidden md:block"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Success Rate
                      </p>
                      <p className="text-lg font-bold">98.5%</p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -right-8 bottom-20 glass-card p-4 rounded-xl border-white/10 animate-float hidden md:block"
                  style={{ animationDelay: "2s" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Goal Reached
                      </p>
                      <p className="text-lg font-bold">Offer Letter</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
