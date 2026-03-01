"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { statusColors } from "./constants";

const sizeConfig = {
  sm: {
    badge: "px-3 py-1 text-xs gap-1",
    icon: "h-3 w-3",
    menuItem: "px-3 py-1",
  },
  md: {
    badge: "px-4 py-2 text-sm gap-2",
    icon: "h-4 w-4",
    menuItem: "px-2 py-1",
  },
  lg: {
    badge: "px-6 py-3 text-base gap-2.5 h-12",
    icon: "h-5 w-5",
    menuItem: "px-6 py-3",
  },
};

export default function StatusChangeSelector({
  status,
  onStatusChange,
  size = "md",
  className = "",
  loading = false,
}) {
  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={loading}>
        <Badge
          variant="outline"
          className={`${statusColors[status]} cursor-pointer flex w-fit items-center justify-between backdrop-blur-md border border-white/10 ${config.badge} ${loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        >
          <span className="truncate">{status}</span>
          {loading ? (
            <Loader2
              className={`${config.icon} animate-spin opacity-50 ml-1`}
            />
          ) : (
            <ChevronDown className={`${config.icon} opacity-50`} />
          )}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-black/90 backdrop-blur-xl border-white/10 z-50 p-1"
      >
        {Object.keys(statusColors).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => onStatusChange(s)}
            className={`focus:bg-transparent hover:bg-transparent rounded-md my-0.5 ${config.menuItem}`}
          >
            <Badge
              variant="outline"
              className={`w-full justify-center ${statusColors[s]} hover:border-current cursor-pointer backdrop-blur-md ${config.badge}`}
            >
              {s}
              {s === status && <Check className="ml-2 h-3 w-3" />}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
