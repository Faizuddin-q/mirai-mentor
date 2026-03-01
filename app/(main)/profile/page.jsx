import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { industries } from "@/data/industries";
import ProfileForm from "./_components/profile-form";

export default async function ProfilePage() {
  try {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Single query to get user data and check onboarding status
    const user = await db.user.findUnique({
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

    if (!user) {
      redirect("/onboarding");
    }

    // Parse industry back to separate fields
    let industry = "";
    let subIndustry = "";
    if (user.industry) {
      const parts = user.industry.split("-");
      industry = parts[0] || "";
      const parsedSubIndustry =
        parts.slice(1).join(" ").replace(/-/g, " ") || "";

      // Find the exact match from industries array to preserve original capitalization
      const industryData = industries.find((ind) => ind.id === industry);
      if (industryData && parsedSubIndustry) {
        // Find matching subIndustry with case-insensitive comparison
        const matchedSubIndustry = industryData.subIndustries.find(
          (sub) =>
            sub.toLowerCase().replace(/\s+/g, " ") ===
            parsedSubIndustry.toLowerCase().replace(/\s+/g, " "),
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
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-6xl font-bold gradient-title">
            Update Your Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Keep your profile information up to date for better career insights
            and recommendations.
          </p>
        </div>

        <ProfileForm industries={industries} initialData={userData} />
      </main>
    );
  } catch (error) {
    console.error("Profile error:", error);
    redirect("/onboarding");
  }
}
