import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/user-context";
import { dark } from "@clerk/themes";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Mirai Mentor",
  description: "Mirai Mentor is a career development platform that helps you accelerate your career growth.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${manrope.variable}`}
      >
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
              <Header />
              <main className="minh-screen mt-4 mb-20">{children}</main>
              <Toaster richColors />
            </UserProvider>

            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Copyright © {new Date().getFullYear()} All Rights Reserved.</p>
              </div>
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>This project is for educational purposes only. It was created by Faizuddin and Dev Sagar for the college minor project.</p>
              </div>

            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
