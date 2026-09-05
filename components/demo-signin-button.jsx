"use client";

import { useSignIn } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function DemoSignInButton() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleDemoLogin = async () => {
    if (!isLoaded || isSigningIn) return;
    setIsSigningIn(true);

    try {
      const result = await signIn.create({
        identifier: "mirai-mentor-demo@gmail.com",
        password: "mir@1mentor",
      });

      if (result.status === "complete") {
        toast.success("Welcome back! Signed in with demo account.");
        await setActive({
          session: result.createdSessionId,
          redirectUrl: "/dashboard",
        });
      } else {
        console.error(result);
        toast.error("Something went wrong during demo login.");
        setIsSigningIn(false);
      }
    } catch (err) {
      console.error("Error:", err.errors?.[0]?.longMessage);
      toast.error(err.errors?.[0]?.longMessage || "Failed to sign in");
      setIsSigningIn(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDemoLogin}
      disabled={!isLoaded || isSigningIn}
      className="border-border"
    >
      {!isLoaded || isSigningIn ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      Demo Sign In
    </Button>
  );
}
