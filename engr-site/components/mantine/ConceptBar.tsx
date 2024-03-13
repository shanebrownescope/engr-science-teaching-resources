// ConceptBar.js
"use client";
import { useState } from "react";
import { Group } from "@mantine/core";
import classes from "./ConceptBar.module.css";

// Update props to include concepts data
export function ConceptBar({ concepts }) {
  const [active, setActive] = useState(concepts[0]?.label || "");

  const links = concepts.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header}>
          <span>Concepts</span>
        </Group>
        {links}
      </div>
    </nav>
  );
}
