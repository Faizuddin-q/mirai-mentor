"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function StatsCards({ stats }) {
  const { interviews } = stats;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-muted/40 hover:bg-muted/60 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-sm font-medium">
            Interviews Scheduled
          </CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{interviews}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Opportunities to shine
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
