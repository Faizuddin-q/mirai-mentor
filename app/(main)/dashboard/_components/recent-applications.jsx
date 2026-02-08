"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Building2 } from "lucide-react";

const statusColors = {
  WISHLIST: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  APPLIED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  OA: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  INTERVIEW: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  OFFER: "bg-green-500/20 text-green-300 border-green-500/30",
  REJECTED: "bg-red-500/20 text-red-300 border-red-500/30",
  WITHDRAWN: "bg-gray-400/20 text-gray-400 border-gray-400/30",
};

export default function RecentApplications({ applications }) {
  return (
    <div className="glass-card p-6 rounded-xl h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none z-0" />
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading">
              Recent Applications
            </h3>
          </div>
          <Link href="/applications">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-primary/20 hover:text-primary hover:bg-primary/10"
            >
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="flex-1">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="p-4 rounded-full bg-white/5 mb-3 animate-pulse">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No recent applications
              </p>
              <Link href="/applications" className="mt-4">
                <Button size="sm" className="btn-primary">
                  Add an Application
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <Link
                  href={`/applications/${app.id}`}
                  key={app.id}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-zinc-800 rounded-md border border-white/10">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {app.jobTitle}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {app.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 font-medium border ${
                          statusColors[app.status] ||
                          "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {app.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(app.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
