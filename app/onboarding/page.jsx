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
    <main className="container mx-auto mt-24 mb-20 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-6xl font-bold gradient-title">
          Complete Your Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Select your industry to get personalized career insights and
          recommendations.
        </p>
      </div>

      <OnboardingForm industries={industries} />
    </main>
  );
}
