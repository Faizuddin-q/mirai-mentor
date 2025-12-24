"use client";

import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  UserPlus,
  Brain,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import DemoSignInButton from "./demo-signin-button";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Resume",
    href: "/resume",
    icon: FileText,
  },
  {
    label: "Cover Letter",
    href: "/ai-cover-letter",
    icon: PenBox,
  },
  {
    label: "Quiz",
    href: "/quiz",
    icon: GraduationCap,
  },
  {
    label: "Smart Answer Desk",
    href: "/smart-answer-desk",
    icon: Brain,
  },
  {
    label: "Applications",
    href: "/applications",
    icon: Briefcase,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserPlus,
  },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <SignedIn>
            <Link href="/dashboard">
              <Image
                src={"/logo.png"}
                alt="Mirai Mentor Logo"
                width={200}
                height={200}
                className="h-12 py-1 w-auto object-contain"
              />
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/">
              <Image
                src={"/logo.png"}
                alt="Mirai Mentor Logo"
                width={200}
                height={200}
                className="h-12 py-1 w-auto object-contain"
              />
            </Link>
          </SignedOut>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 md:space-x-2 gap-2">
          <SignedIn>
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch
                    className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                      active
                        ? "text-primary border-b border-primary pb-1"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
          </SignedIn>

          <SignedIn>
            <div className="md:hidden flex items-center gap-2 mr-2">
               {navItems.map(({ href, icon: Icon }) => {
                   const active = isActive(href);
                   return(
                     <Link key={href} href={href}>
                         <Button
                            variant={active ? "default" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                         >
                            <Icon className="h-4 w-4" />
                         </Button>
                     </Link>
                   )
               })}
            </div>
          </SignedIn>

          <SignedOut>
            <DemoSignInButton />
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
