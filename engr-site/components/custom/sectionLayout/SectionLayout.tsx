import React from 'react'

type SectionLayoutProps = {
  children: React.ReactNode;
}

const SectionLayout = ({ children }: SectionLayoutProps) => {
  return (
    <section className="section-container">
      {children}
    </section>
  )
}

export default SectionLayout;