"use client";
import React from "react";
import {
  GuestHeaderMegaMenu,
  HeroBullets,
  HeroText,
  GetInTouchSimple,
  EmailBanner,
  FeaturesCards,
  TechnologyOverview,
  InstructionsContainer,
  TeamContainer
} from "@/components/mantine";
import "@mantine/core/styles.css";
import Footer from "@/components/custom/footer/Footer";

export default function Home() {
  return (
    <div>
      <GuestHeaderMegaMenu />
      <FeaturesCards />
      <HeroBullets />
      <InstructionsContainer />
      <TechnologyOverview />
      <TeamContainer />
      <GetInTouchSimple />
      <Footer />
    </div>
  );
}
