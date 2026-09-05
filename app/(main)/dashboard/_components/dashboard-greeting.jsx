"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/frontend/contexts/user-context";
import { Card, CardContent } from "@/frontend/components/ui/card";
import {
  Lightbulb,
  Calendar,
  CheckCircle,
  Sparkles,
  Trophy,
} from "lucide-react";

// Curated list of career tips (fallback/default)
const careerTips = [
  "Use the STAR method in interviews: Situation, Task, Action, Result.",
  "Tailor your resume for every job application. Keywords matter.",
  "Research the company's culture and values before the interview.",
  "Ask thoughtful questions at the end of an interview to show interest.",
  "Networking is key: 70-80% of jobs aren't published.",
  "Keep your LinkedIn profile up-to-date and active.",
  "Practice active listening during interviews.",
  "Follow up with a thank-you email within 24 hours of an interview.",
  "Quantify your achievements on your resume with numbers.",
  "Soft skills like communication and adaptability are highly valued.",
];

export default function DashboardGreeting({ stats }) {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("Hello");
  const [tip, setTip] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Set a random tip
    const randomTip = careerTips[Math.floor(Math.random() * careerTips.length)];
    setTip(randomTip);
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Greeting Card - Consistent Glass Card */}
      <div className="glass-card p-6 md:p-8 rounded-xl flex flex-col justify-between overflow-hidden relative min-h-[220px]">
        {/* Ambient Glow Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none z-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          {/* Left: Greeting & Primary Stat */}
          <div className="space-y-4 max-w-lg">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {greeting}, <br />
                <span className="gradient-title">{user.name}!</span>
              </h2>
              <p className="text-muted-foreground mt-2 text-base">
                Ready to conquer your career goals today?
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <p className="text-lg flex items-center gap-2 bg-background/40 px-4 py-2 rounded-full border border-primary/20 shadow-sm backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-foreground" />
                <span className="font-bold text-primary">
                  {stats?.interviews || 0}
                </span>
                <span className="text-muted-foreground">
                  Scheduled Interviews
                </span>
              </p>

              {/* Add another stat if available, or a generic motivator */}
              {/* <div className="flex items-center gap-2 bg-background/40 px-4 py-2 rounded-full border border-blue-500/20 shadow-sm backdrop-blur-sm">
                <Trophy className="h-5 w-5 text-blue-500" />
                <span className="text-muted-foreground text-sm">
                  Keep winning!
                </span>
              </div> */}
            </div>
          </div>

          {/* Right: Daily Tip (Floating Card Style) */}
          <div className="w-full md:w-auto md:max-w-xs self-start md:self-end">
            <div className="bg-background/20 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg transform transition-transform group-hover:scale-[1.02]">
              <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <Lightbulb className="h-4 w-4" />
                <span>Daily Pro Tip</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed italic">
                "{tip}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
