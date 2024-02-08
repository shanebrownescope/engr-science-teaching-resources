"use client";
import React from "react";
import { LecturePage } from "../../components";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function Home({ Component, pageProps }) {
  return (
    <MantineProvider>
      <LecturePage />
    </MantineProvider>
  );
}
