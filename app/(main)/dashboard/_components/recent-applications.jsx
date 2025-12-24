"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

const statusColors = {
  WISHLIST: "bg-gray-500",
  APPLIED: "bg-blue-500",
  OA: "bg-purple-500",
  INTERVIEW: "bg-yellow-500",
  OFFER: "bg-green-500",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-gray-400",
};

export default function RecentApplications({ applications }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Applications</CardTitle>
        <Link href="/applications">
          <Button variant="outline" size="sm" className="text-xs border-border">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="p-3 rounded-full bg-muted mb-3">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No recent applications
            </p>
            <Link href="/applications" className="mt-2">
              <Button size="sm" variant="outline">
                Add an Application
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {app.jobTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {app.companyName}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(app.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className={`text-[10px] px-2 py-0.5 text-white ${
                    statusColors[app.status] || "bg-gray-500"
                  }`}
                >
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
