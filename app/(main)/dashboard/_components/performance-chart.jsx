"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      // Take only the last 7 assessments for the dashboard view
      const recentAssessments = assessments.slice(-10);

      const formattedData = recentAssessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <div className="glass-card p-6 rounded-xl h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none z-0" />
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading">Quiz Performance</h3>
          </div>
          <Link href="/quiz">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-primary/20 hover:text-primary hover:bg-primary/10"
            >
              Attempt Quiz <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.1}
                stroke="#ffffff"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="glass-card !p-3 !border-white/10 !bg-slate-900/90 shadow-xl rounded-lg text-xs">
                        <p className="font-bold text-primary mb-1">
                          Score: {payload[0].value}%
                        </p>
                        <p className="text-gray-300">
                          {payload[0].payload.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(24 94% 63%)" // Primary Orange
                strokeWidth={3}
                activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "#1e293b",
                  stroke: "hsl(24 94% 63%)",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
