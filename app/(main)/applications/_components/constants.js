export const statusColors = {
  WISHLIST: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  APPLIED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  OA: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  INTERVIEW: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  OFFER: "bg-green-500/10 text-green-500 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
  WITHDRAWN: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export const statusDotColors = {
  WISHLIST: "bg-zinc-500",
  APPLIED: "bg-blue-500",
  OA: "bg-purple-500",
  INTERVIEW: "bg-amber-500",
  OFFER: "bg-green-500",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-gray-500",
};

export const statusMessages = {
  WISHLIST: "Added to your wishlist!",
  APPLIED: "Application sent! Good luck!",
  OA: "Online Assessment received! You got this!",
  INTERVIEW: "Interview scheduled! Go get them!",
  OFFER: "Offer received! Congratulations!",
  REJECTED: "Keep going! The right one is out there.",
  WITHDRAWN: "Application withdrawn. On to the next!",
};

export const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "7", label: "Last 7 Days" },
  { value: "14", label: "Last 14 Days" },
  { value: "30", label: "Last 30 Days" },
];

export const formatJobType = (jobType) => {
  const jobTypeMap = {
    FULL_TIME: "Full Time",
    INTERN: "Intern",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
    CONTRACT: "Contract",
  };
  return jobTypeMap[jobType] || jobType;
};
