"use client";
import React from "react";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { HeaderMegaMenu, CourseCard } from "../../../components/mantine";
import { useParams } from "next/navigation";

export default function Course() {
  const params = useParams<{ coursename: string }>();

  return (
    <MantineProvider>
      <HeaderMegaMenu />
      <h1>Course: {params.coursename}</h1>
      <CourseCard />
      <CourseCard />
      <CourseCard />
    </MantineProvider>
  );
}
