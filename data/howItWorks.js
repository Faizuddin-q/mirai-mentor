import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Onboard & Personalize",
    description: "Share your career goals and background. We'll tailor a roadmap just for you.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Build Your Documents",
    description: "Create ATS-friendly resumes and cover letters using our AI-powered builders.",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Ace the Interview",
    description:
      "Practice with role-specific AI mock interviews and get instant performance feedback.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track & Succeed",
    description: "Organize applications, track progress, and land your dream job with confidence.",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
