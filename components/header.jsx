"use client";

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
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Explore",
    href: "/explore",
    icon: LayoutDashboard,
  },
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
    label: "Interview",
    href: "/interview",
    icon: GraduationCap,
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
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname?.startsWith(`${href}/`);
  };

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
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);

              return (
                <Link key={href} href={href} prefetch>
                  <Button
                    variant={active ? "default" : "outline"}
                    className="hidden md:inline-flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className="md:hidden w-10 h-10 p-0"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              );
            })}
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
