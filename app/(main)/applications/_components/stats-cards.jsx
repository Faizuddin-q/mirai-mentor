"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
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
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total Applications */}
      <div className="glass-card p-6 rounded-xl border-l-4 border-l-blue-500 relative overflow-hidden group">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground group-hover:text-blue-400 transition-colors">
            Total Applications
          </h3>
          <div className="p-2 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform">
            <LayoutDashboard className="h-4 w-4 text-blue-500" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground group-hover:text-blue-200 transition-colors">
          {total}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {total === 0
            ? "Start planting your future!"
            : "Seeds planted for growth"}
        </p>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
      </div>

      {/* Interviews Scheduled */}
      <div className="glass-card p-6 rounded-xl border-l-4 border-l-amber-500 relative overflow-hidden group">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground group-hover:text-amber-400 transition-colors">
            Interviews
          </h3>
          <div className="p-2 bg-amber-500/10 rounded-lg group-hover:scale-110 transition-transform">
            <Target className="h-4 w-4 text-amber-500" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground group-hover:text-amber-200 transition-colors">
          {interviews}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {interviews === 0
            ? "Keep applying, offers are coming!"
            : "Closer to your next job!"}
        </p>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
      </div>

      {/* Monthly Momentum */}
      <div className="glass-card p-6 rounded-xl border-l-4 border-l-green-500 relative overflow-hidden group">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground group-hover:text-green-400 transition-colors">
            Momentum
          </h3>
          <div className="p-2 bg-green-500/10 rounded-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground group-hover:text-green-200 transition-colors">
          {momentum}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {momentum === 0
            ? "No applications this month."
            : "Applications this month!"}
        </p>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all pointer-events-none" />
      </div>
    </div>
  );
}
