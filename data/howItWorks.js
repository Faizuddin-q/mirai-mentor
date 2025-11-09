import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Define Your Milestones",
    description: "Outline promotion goals, target roles, and the timeline you want to hit",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Generate Action Blueprints",
    description: "Receive AI-crafted skill plans, outreach scripts, and interview drills",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Practice with Live Feedback",
    description:
      "Run mock conversations while adaptive prompts and scoring fine-tune your responses",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Review Insights & Iterate",
    description: "Use weekly analytics and mentor notes to adjust your plan and stay ahead",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
