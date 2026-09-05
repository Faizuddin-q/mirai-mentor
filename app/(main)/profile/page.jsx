import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/backend/features/user/actions";
import { industries } from "@/frontend/data/industries";
import ProfileForm from "./_components/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let userData;
  try {
    userData = await getCurrentUser();
  } catch (error) {
    console.error("Profile error:", error);
    redirect("/onboarding");
  }

  return (
    <main className="container mx-auto">
      <ProfileForm industries={industries} initialData={userData} />
    </main>
  );
}
