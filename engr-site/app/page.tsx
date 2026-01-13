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
import {
  Badge,
  Group,
  Title,
  Text
} from "@mantine/core";
import "@mantine/core/styles.css";
import classes from "./page.module.css"
import Footer from "@/components/custom/footer/Footer";

export default function Home() {
  return (
    <div>
      <GuestHeaderMegaMenu />

      <Group justify="center">
        <Badge variant="filled" size="lg">
          Brought to you by Oregon State University
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Interactive Learning & Engagement Repository
      </Title>

      <Text c="dimmed" className={classes.titleDescription} ta="center" mt="md">
        Connecting educators through curated, community-rated learning materials
      </Text>
      
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
