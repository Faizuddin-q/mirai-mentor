"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Target, TrendingUp, LayoutDashboard } from "lucide-react";

export default function StatsCards({ stats }) {
  const { total, interviews, momentum } = stats;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Only show confetti if there's significant momentum or interviews
    if (momentum > 0 || interviews > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [momentum, interviews]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-4">
      <Card
        className={`relative overflow-hidden transition-all duration-300 bg-muted/40 hover:shadow-lg hover:-translate-y-1 border-primary/50 shadow-primary/10`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <LayoutDashboard className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {total === 0
              ? "Start planting your future!"
              : "Seeds planted for growth"}
          </p>
        </CardContent>
      </Card>

      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-muted/40 border-muted-foreground/20 ${
          interviews > 0 ? "border-primary/50 shadow-primary/10" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{interviews}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {interviews === 0
              ? "Keep applying, offers are coming!"
              : "Closer to your next job!"}
          </p>
        </CardContent>
      </Card>

      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-muted/40 border-muted-foreground/20 ${
          momentum > 5 ? "border-primary/50 shadow-primary/10" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-sm font-medium">Monthly Momentum</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{momentum}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {momentum === 0
              ? "No applications this month."
              : "Applications this month!"}
          </p>
        </CardContent>
      </Card>
      {/* Confetti logic preserved if needed, but 'Soft Rewards' are now handled by hover states and subtle borders */}
    </div>
  );
}
