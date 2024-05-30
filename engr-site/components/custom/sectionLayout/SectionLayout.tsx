import React from "react";

type SectionLayoutProps = {
  children: React.ReactNode;
};

/**
 * Renders a section layout.
 *
 * @param {SectionLayoutProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered SectionLayout component.
 */
const SectionLayout = ({ children }: SectionLayoutProps) => {
  return <section className="section-container">{children}</section>;
};

export default SectionLayout;
