"use client";
import React from "react";
import { HeaderMegaMenu, HeroBullets } from "@/components/mantine";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function Home() {
  return (
    <MantineProvider>
      <HeaderMegaMenu />
      <HeroBullets />
    </MantineProvider>
  );
}
