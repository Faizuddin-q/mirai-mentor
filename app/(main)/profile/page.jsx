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
      subIndustry = parts.slice(1).join(" ").replace(/-/g, " ") || "";
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
  } catch (error) {
    console.error("Profile error:", error);
    redirect("/onboarding");
  }
}
