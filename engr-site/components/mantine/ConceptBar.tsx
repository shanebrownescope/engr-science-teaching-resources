"use client";
import { useState } from "react";
import { Group, Code } from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./ConceptBar.module.css";

const data = [
  { link: "", label: "Notifications" },
  { link: "", label: "Billing" },
  { link: "", label: "Security" },
  { link: "", label: "SSH Keys" },
  { link: "", label: "Databases" },
  { link: "", label: "Authentication" },
  { link: "", label: "Other Settings" },
];

export function ConceptBar() {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
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
