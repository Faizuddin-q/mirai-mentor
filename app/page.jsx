import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  Users2,
  GraduationCap,
  Lightbulb,
  Compass,
} from "lucide-react";
import HeroSection from "@/components/hero";
import SectionBadge from "@/components/ui/section-badge";
import ScrollReveal from "@/components/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { stats } from "@/data/stats";
import { roadmap } from "@/data/roadmap";
import { howItWorks } from "@/data/howItWorks";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { getUserOnboardingStatus } from "@/actions/user";


export default async function LandingPage() {
  // const { userId } = await auth();

  // if (userId) {
  //   const { isOnboarded } = await getUserOnboardingStatus();
  //   if (isOnboarded) {
  //     redirect("/dashboard");
  //   } else {
  //     redirect("/onboarding");
  //   }
  // }
  
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background relative overflow-hidden">
        {/* Decorative background elements */}
        {/* <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" /> */}

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <SectionBadge
                icon={<Sparkles className="h-4 w-4" />}
                title="Powerful Features"
              />
              <h2 className="text-3xl font-bold tracking-tighter md:text-5xl text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Everything You Need for Career Growth
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed text-balance">
                Our comprehensive suite of AI-powered tools is designed to accelerate your career journey from start to finish.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group relative border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.4rem)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="pt-8 pb-8 px-6 relative z-10 flex flex-col items-center text-center h-full">
                    <div className="p-4 rounded-full bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
              <SectionBadge
                icon={<Compass className="h-4 w-4" />}
                title="Our Approach"
              />
              <h2 className="text-3xl font-bold md:text-5xl text-balance">
                Your Career Journey in Four Steps
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed text-balance">
                We guide you through a structured process to ensure you achieve your professional goals.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="space-y-12 max-w-7xl mx-auto">
              {/* Steps could be visualized differently, but keeping grid for now with better styling */}
              <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                {roadmap.map((item, index) => (
                  <Card
                    key={index}
                    className="group relative border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="pt-8 pb-8 px-6 relative z-10 flex flex-col items-center text-center h-full">
                      <div className="p-4 rounded-full bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                      <span className="absolute top-4 right-4 text-6xl font-black text-muted/10 pointer-events-none group-hover:text-muted/20 transition-colors">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-background" id="how-it-works">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4 text-balance">How It Works</h2>
              <p className="text-muted-foreground text-balance">
                Four simple steps to accelerate your career growth
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
              {howItWorks.map((item, index) => (
                <Card
                  key={index}
                  className="group relative border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="pt-8 pb-8 px-6 relative z-10 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* User Feedback */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-16 text-balance">
              Trusted by Professionals
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonial.map((testimonial, index) => (
                <Card key={index} className="bg-muted/20 border-border hover:bg-muted/40 transition-colors">
                  <CardContent className="pt-8">
                    <div className="flex flex-col space-y-6">
                      <div className="relative">
                        <span className="text-6xl text-primary/20 font-serif absolute -top-8 -left-2">&ldquo;</span>
                        <p className="text-muted-foreground italic relative z-10 px-2">
                          {testimonial.quote}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 border-t border-border pt-6">
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            width={48}
                            height={48}
                            src={testimonial.image}
                            alt={testimonial.author}
                            className="rounded-full object-cover border-2 border-primary/20"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.role} @ <span className="text-primary">{testimonial.company}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-muted/10">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our platform
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-card px-4">
                    <AccordionTrigger className="text-left py-4 hover:no-underline hover:text-primary transition-colors font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full">
        <div className="mx-auto py-24 gradient rounded-lg">
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter gradient-title sm:text-4xl md:text-5xl">
                Ready to Start Your Career Journey?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Get started with AI-powered guidance to help you achieve your
                career goals.
              </p>
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  className="h-11 mt-5 animate-bounce"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
