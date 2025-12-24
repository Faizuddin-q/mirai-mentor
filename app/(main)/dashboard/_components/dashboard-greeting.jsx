"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Sparkles } from "lucide-react";

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
    else if (hour < 16) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Set a random tip
    const randomTip = careerTips[Math.floor(Math.random() * careerTips.length)];
    setTip(randomTip);
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Greeting & Status Card */}
      <Card className="flex-[2] bg-primary/5 border-primary/10 shadow-sm relative overflow-hidden">
        <CardContent className="flex flex-col justify-center h-full p-4 relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, <span className="text-foreground">{user.name}</span>!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            You have{" "}
            <span className="font-bold text-primary">
              {stats?.interviews || 0} interviews
            </span>{" "}
            scheduled.
          </p>
        </CardContent>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
      </Card>

      {/* Daily Tip Card */}
      <Card className="flex-1 border bg-muted/30 shadow-none">
        <CardContent className="h-full p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 text-amber-500 font-semibold text-sm">
            <Lightbulb className="h-4 w-4" />
            <span>Daily Tip</span>
          </div>
          <p className="text-muted-foreground italic text-sm leading-relaxed">
            "{tip}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
