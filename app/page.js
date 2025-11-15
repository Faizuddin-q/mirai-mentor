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
  Compass,
  Layers,
  BarChart3,
  CalendarCheck,
  Users2,
  GraduationCap,
  MonitorPlay,
  Lightbulb,
} from "lucide-react";
import HeroSection from "@/components/hero";
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
import { howItWorks } from "@/data/howItWorks";
import { industries } from "@/data/industries";

const momentumRoadmap = [
  {
    title: "Define Your Goals",
    description:
      "Identify your target role, career level, and timeline for your career journey.",
    icon: Compass,
  },
  {
    title: "Create Your Plan",
    description:
      "Build a personalized roadmap with skill development, networking, and career strategies.",
    icon: Layers,
  },
  {
    title: "Practice & Learn",
    description:
      "Practice interviews, scenarios, and communication skills with helpful feedback.",
    icon: MonitorPlay,
  },
  {
    title: "Track Progress",
    description:
      "Monitor your progress and adjust your approach based on your achievements.",
    icon: BarChart3,
  },
];

const outcomeHighlights = [
  {
    title: "Career Preparation",
    description:
      "Prepare for performance reviews and career advancement with helpful resources and guidance.",
    icon: Trophy,
  },
  {
    title: "Job Search Support",
    description:
      "Get assistance with applications, networking, and interview preparation.",
    icon: ArrowRight,
  },
  {
    title: "Skill Development",
    description:
      "Practice communication and leadership skills with AI-powered coaching tools.",
    icon: Users2,
  },
];

const resourceLibrary = [
  {
    title: "Career Guides",
    description:
      "Helpful guides on storytelling, portfolio building, and interview preparation.",
    icon: CalendarCheck,
  },
  {
    title: "Industry Insights",
    description:
      "Learn about different roles, skills in demand, and career opportunities.",
    icon: Lightbulb,
  },
  {
    title: "Skill Workshops",
    description:
      "Access resources and tips for negotiation, communication, and professional development.",
    icon: GraduationCap,
  },
];

const careerSpotlights = industries.slice(0, 6).map((industry) => ({
  title: industry.name ?? industry.title ?? "Emerging Industry",
  region: industry.region ?? "Global",
  description:
    industry.description ??
    `Explore roles across ${industry.subIndustries
      ?.slice(0, 3)
      .join(", ") ?? "high-growth domains"} and beyond.`,
  skills:
    industry.skills ??
    industry.subIndustries?.slice(0, 4) ?? ["Leadership", "Strategy", "Growth"],
}));

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 text-balance">
            Features for Career Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-all duration-300 card-hover border-glow"
              >
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="w-full py-12 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Our Approach
            </span>
            <h2 className="text-3xl font-bold md:text-4xl text-balance">
              Your Career Journey in Four Steps
            </h2>
            <p className="text-muted-foreground md:text-lg text-balance">
              From planning to execution, we guide you through structured steps
              to help you achieve your career goals.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {momentumRoadmap.map((item, index) => (
              <Card
                key={item.title}
                className="relative h-full border-border/60 bg-background/90 backdrop-blur transition-all duration-300 card-hover"
              >
                <CardContent className="flex h-full flex-col gap-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-4xl font-bold text-primary/30">
                      {index + 1}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Career Playbooks */}
      <section
        className="w-full py-12 md:py-24 bg-background scroll-mt-32 md:scroll-mt-40"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl text-balance">
              Career Paths & Resources
            </h2>
            <p className="text-muted-foreground md:text-lg text-balance">
              Explore different career paths and get guidance on skills,
              networking, and industry insights tailored to your goals.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {careerSpotlights.map((industry) => (
              <Card
                key={industry.title}
                className="h-full border-border/70 bg-card/90 transition-all duration-300 card-hover"
              >
                <CardContent className="flex h-full flex-col gap-4 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{industry.title}</h3>
                      <p className="text-xs uppercase tracking-wide text-primary">
                        {industry.region}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {industry.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {industry.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section         id="how-it-works"
        className="w-full py-12 md:py-24 bg-background"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-balance">How It Works</h2>
            <p className="text-muted-foreground text-balance">
              Simple steps to help you grow in your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 rounded-md border border-border bg-card px-4 py-3 shadow-sm transition-all duration-300 card-hover"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto mb-12 text-center space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl text-balance">
              What You Can Achieve
            </h2>
            <p className="text-muted-foreground md:text-lg text-balance">
              Get structured guidance and actionable resources to help you
              advance in your career journey.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {outcomeHighlights.map((item) => (
              <Card
                key={item.title}
                className="h-full border-border/70 bg-background/95 backdrop-blur transition-all duration-300 card-hover"
              >
                <CardContent className="flex h-full flex-col gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-balance">
            User Feedback
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-background transition-all duration-300 card-hover">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-primary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">
                          &quot;
                        </span>
                        {testimonial.quote}
                        <span className="text-3xl text-primary absolute -bottom-4">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Resource Library */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl text-balance">
              Learning Resources
            </h2>
            <p className="text-muted-foreground md:text-lg text-balance">
              Access helpful resources, guides, and tips to support your career
              development journey.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {resourceLibrary.map((resource) => (
              <Card
                key={resource.title}
                className="h-full border-border/70 bg-card/95 transition-all duration-300 card-hover"
              >
                <CardContent className="flex h-full flex-col gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <resource.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full">
        <div className="mx-auto py-24 gradient rounded-lg">
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
        </div>
      </section>
    </>
  );
}
