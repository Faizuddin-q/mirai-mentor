import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/backend/features/user/actions";

const MainLayout = async ({ children }) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return <div className="container mx-auto mt-24 mb-20">{children}</div>;
};

export default MainLayout;
