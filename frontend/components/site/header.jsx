"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  UserPlus,
  Brain,
  Briefcase,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import DemoSignInButton from "./demo-signin-button";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";

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
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Desktop Navigation */}
          <SignedIn>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch
                    className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                      active
                        ? "text-primary border-b-2 border-primary pb-1"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </SignedIn>

          {/* Mobile Navigation */}
          <SignedIn>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {navItems.map(({ label, href, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                      <DropdownMenuItem key={href} asChild>
                        <Link
                          href={href}
                          prefetch
                          className={`flex items-center gap-2 w-full cursor-pointer ${
                            active
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
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
