import React from "react";
import Link from "next/link";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
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
import HeroSection from "@/frontend/components/site/hero";
import SectionBadge from "@/frontend/components/ui/section-badge";
import ScrollReveal from "@/frontend/components/site/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/frontend/components/ui/accordion";
import Image from "next/image";
import { features } from "@/frontend/data/landing/features";
import { testimonial } from "@/frontend/data/landing/testimonial";
import { faqs } from "@/frontend/data/landing/faqs";
import { stats } from "@/frontend/data/landing/stats";
import { roadmap } from "@/frontend/data/landing/roadmap";
import { howItWorks } from "@/frontend/data/landing/howItWorks";

export default async function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section - V3: Masonry Layout */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <SectionBadge
                icon={<Sparkles className="h-4 w-4" />}
                title="Your Toolkit for the Future"
              />
              <h2 className="text-3xl font-bold tracking-tighter md:text-5xl text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Beyond Standard. <br />
                <span className="gradient-title">Architectural Precision.</span>
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed text-balance">
                We've built a suite of tools that doesn't just "help" you—it
                engineers your path to success.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`
                    transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between border-0 shadow-none
                    bg-white/5 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2
                    ${index === 0 ? "md:col-span-6 lg:col-span-8 lg:row-span-2 bg-white/5" : ""}
                    ${index === 1 ? "md:col-span-6 lg:col-span-4 bg-white/5" : ""}
                    ${index === 2 ? "md:col-span-6 lg:col-span-4 bg-white/5" : ""}
                    ${index === 3 ? "md:col-span-6 lg:col-span-6 bg-white/5" : ""}
                    ${index === 4 ? "md:col-span-6 lg:col-span-6 bg-white/5" : ""}
                    group glass-card-hover
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-primary/30 transition-colors duration-300" />

                  <CardContent className="p-8 relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`p-4 rounded-2xl bg-white/5 text-muted-foreground transition-all duration-300 group-hover:text-primary-foreground ${index === 0 ? "scale-110" : ""}`}
                      >
                        {feature.icon}
                      </div>
                      <span className="text-4xl font-black text-white/5 group-hover:text-primary transition-colors duration-300 font-heading">
                        {index + 1}
                      </span>
                    </div>

                    <div className="mt-auto space-y-3">
                      <h3
                        className={`font-bold font-heading text-foreground transition-colors duration-300 ${index === 0 ? "text-3xl md:text-4xl" : "text-xl"}`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300 ${index === 0 ? "text-lg md:text-xl" : ""}`}
                      >
                        {feature.description}
                      </p>
                    </div>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform duration-500 hover:border-primary/50 group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-4xl md:text-5xl font-black gradient-title mb-2 tracking-tight group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </h3>
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs text-center">
                    {stat.label}
                  </p>
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
                title="The Blueprint"
              />
              <h2 className="text-3xl font-bold md:text-5xl text-balance">
                4 Steps to <span className="gradient-title">Domination</span>
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed text-balance">
                A structured execution plan to take you from applicant to hired
                professional.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="space-y-12 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {roadmap.map((item, index) => (
                  <Card
                    key={index}
                    className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="pt-8 pb-8 px-6 relative z-10 flex flex-col items-center text-center h-full">
                      <div className="p-4 rounded-full bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300  shadow-lg shadow-primary/10">
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 font-heading group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                      <span className="absolute top-4 right-4 text-7xl font-black text-white/5 pointer-events-none group-hover:text-primary transition-colors select-none font-heading -rotate-12">
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
      <section
        className="w-full py-12 md:py-24 bg-background relative overflow-hidden"
        id="how-it-works"
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionBadge
                icon={<Lightbulb className="w-4 h-4" content="center" />}
                title="Our Process"
              />
              <h2 className="text-3xl font-bold md:text-5xl mb-4 text-balance font-heading mt-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-balance md:text-xl">
                Four simple steps to accelerate your career growth
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative">
              {/* Connected Progress Line (Desktop) */}
              <div className="hidden lg:block absolute top-[3rem] left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-primary/80 z-0"></div>

              {howItWorks.map((item, index) => (
                <div key={index} className="relative z-10 group">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-24 h-24 rounded-full bg-background border-4 border-white/10 flex items-center justify-center mb-6 relative transition-colors duration-300 shadow-xl z-10 animate-border-beam"
                      style={{
                        animationDelay: `${[-0.5, 0.4, 1.3, 2.2][index]}s`,
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-heading text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* User Feedback */}
      <section className="w-full py-12 md:py-24 bg-background overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 mb-12">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-16 text-balance">
              The Vanguard of Tomorrow
            </h2>
          </ScrollReveal>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="flex space-x-8 animate-scroll hover:pause px-4">
            {[...testimonial, ...testimonial, ...testimonial].map(
              (testimonial, index) => (
                <Card
                  key={index}
                  className="glass-card w-[450px] flex-shrink-0 border-white/5 hover:border-primary/30 transition-colors bg-white/5"
                >
                  <CardContent className="p-10 h-full flex flex-col justify-between">
                    <div className="relative mb-6">
                      <span className="text-8xl text-primary/10 font-serif absolute -top-10 -left-6 pointer-events-none">
                        “
                      </span>
                      <p className="text-muted-foreground italic relative z-10 text-xl leading-relaxed font-light">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                      <div className="relative h-14 w-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                        <Image
                          width={56}
                          height={56}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-bold font-heading text-lg">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {testimonial.role} @{" "}
                          <span className="text-primary font-bold">
                            {testimonial.company}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
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
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-lg bg-card px-4"
                  >
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
      <section className="w-full py-20 relative overflow-hidden">
        <div className="mx-auto w-full max-w-5xl relative px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 blur-3xl rounded-full opacity-50 pointer-events-none" />
          <div className="glass-card p-12 md:p-24 rounded-3xl border-primary/20 relative z-10 text-center space-y-10 overflow-hidden bg-black/40 backdrop-blur-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <h2 className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl font-heading text-white">
              Ready to <span className="gradient-title">Ascend?</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-2xl leading-relaxed font-light mb-8">
              Join the elite circle of professionals who stopped guessing and
              started engineering their careers.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="xl"
                className="h-16 px-12 mt-8 text-xl mt-16 animate-bounce hover:animate-none hover:scale-105 transition-all duration-5000 btn-primary rounded-full shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]"
              >
                Get Started Now <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
