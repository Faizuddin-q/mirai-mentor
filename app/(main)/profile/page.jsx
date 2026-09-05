import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { industries } from "@/data/industries";
import ProfileForm from "./_components/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user;
  try {
    // Single query to get user data and check onboarding status
    user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        industry: true,
        bio: true,
        experience: true,
        skills: true,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    redirect("/onboarding");
  }

  if (!user) {
    redirect("/onboarding");
  }

  // Parse industry back to separate fields
  let industry = "";
  let subIndustry = "";
  if (user.industry) {
    const parts = user.industry.split("-");
    industry = parts[0] || "";
    const parsedSubIndustry = parts.slice(1).join(" ").replace(/-/g, " ") || "";

    // Find the exact match from industries array to preserve original capitalization
    const industryData = industries.find((ind) => ind.id === industry);
    if (industryData && parsedSubIndustry) {
      // Find matching subIndustry with case-insensitive comparison
      const matchedSubIndustry = industryData.subIndustries.find(
        (sub) => sub.toLowerCase().replace(/\s+/g, " ") === parsedSubIndustry.toLowerCase().replace(/\s+/g, " ")
      );
      subIndustry = matchedSubIndustry || parsedSubIndustry;
    } else {
      subIndustry = parsedSubIndustry;
    }
  }

  const userData = {
    ...user,
    industry,
    subIndustry,
    skills: user.skills ? user.skills.join(", ") : "",
  };

  return (
    <main className="container mx-auto">
      <ProfileForm industries={industries} initialData={userData} />
    </main>
  );
}
