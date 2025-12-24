import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";

export default async function OnboardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main className="container mx-auto mt-24 mb-20">
      <OnboardingForm industries={industries} />
    </main>
  );
}

