import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="Sensai Logo"
            width={200}
            height={200}
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <SignedIn>
            {/* Dashboard */}
            <Link href="/dashboard" prefetch={true}>
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Explore   
              </Button> 
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            {/* Resume Builder */}
            <Link href="/resume" prefetch={true}>
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Resume
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </Link>

            {/* Cover Letter */}
            <Link href="/ai-cover-letter" prefetch={true}>
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <PenBox className="h-4 w-4" />
                Cover Letter
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <PenBox className="h-4 w-4" />
              </Button>
            </Link>

            {/* Interview Prep */}
            <Link href="/interview" prefetch={true}>
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Interview
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <GraduationCap className="h-4 w-4" />
              </Button>
            </Link>

            {/* Profile */}
            <Link href="/profile" prefetch={true}>
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <UserPlus className="h-4 w-4" />
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
