// ConceptBar.js
"use client";
import { useState, useEffect } from "react";
import { Group } from "@mantine/core";
import classes from "./ConceptBar.module.css";

type ConceptBarProps = {
  concepts: any[];
  selectedConcept: string;
  onConceptChange: (concept: string) => void;
  onConceptIdChange: (conceptId: string) => void;
};

/**
 * Renders a navigation bar for selecting concepts.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.concepts - The list of concepts to display.
 * @param {string} props.selectedConcept - The currently selected concept.
 * @param {Function} props.onConceptChange - Function to call when the concept is changed.
 * @param {Function} props.onConceptIdChange - Function to call when the concept ID is changed.
 * @returns {JSX.Element} - The rendered ConceptBar component.
 */
export function ConceptBar({
  concepts,
  selectedConcept,
  onConceptChange,
  onConceptIdChange,
}: ConceptBarProps) {
  const [active, setActive] = useState(selectedConcept);

  // Update the active state based on the selectedConcept prop
  useEffect(() => {
    setActive(selectedConcept); // This will set the active concept based on the prop passed from the parent
  }, [selectedConcept]); // Dependency array ensures this effect runs only when selectedConcept changes

  const links = concepts.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        onConceptChange(item.label);
        onConceptIdChange(item.id);
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
