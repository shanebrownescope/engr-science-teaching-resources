"use client";
import React from "react";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { HeaderMegaMenu, Comment } from "../../../../components/mantine";
import { SimilarDocument, Document } from "../../../../components/custom";
import { useParams } from "next/navigation";
import "./page.css";

export default function Lecture() {
  const params = useParams<{ lecturename: string }>();

  return (
    <MantineProvider>
      <HeaderMegaMenu />
      <h1>Lecture: {params.lecturename}</h1>
      <Document />
      <div className="acknowledgements-container">
        <h2>Acknowledgements</h2>
        <ul>
          <li>Name 1</li>
          <li>Name 2</li>
          <li>Name 3</li>
        </ul>
      </div>
      <h2>Similar Documents</h2>
      <div className="similar-documents-container">
        <SimilarDocument />
        <SimilarDocument />
        <SimilarDocument />
      </div>
      <h2>Comments</h2>
      <div className="comment-container">
        {" "}
        {/* Wrap Comments for targeted padding */}
        <Comment />
        <Comment />
      </div>
    </MantineProvider>
  );
}
