"use client";

import { useSignIn } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DemoSignInButton() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const handleDemoLogin = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: "mirai-mentor-demo@gmail.com",
        password: "mir@1mentor",
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await router.push("/dashboard");
        await toast.success("Welcome back! Signed in with demo account.");
      } else {
        console.error(result);
        toast.error("Something went wrong during demo login.");
      }
    } catch (err) {
      console.error("Error:", err.errors?.[0]?.longMessage);
      toast.error(err.errors?.[0]?.longMessage || "Failed to sign in");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDemoLogin}
      disabled={!isLoaded}
      className="border-border"
    >
      {!isLoaded ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      Demo Sign In
    </Button>
  );
}
