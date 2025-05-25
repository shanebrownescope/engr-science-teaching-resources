export type FooterData = {
  title: string;
  links: { label: string; link: string }[];
} 

export const footerData: FooterData[] = [
  {
    title: "Company",
    links: [
      {
        label: "Request Form",
        link: "/request-form",
      },
    ],
  },
  {
    title: "Quick Links",
    links: [
      {
        label: "Home",
        link: "/home",
      },
      {
        label: "Courses",
        link: "/courses",
      },
    ],
  },
  {
    title: "Docs",
    links: [
      {
        label: "Github",
        link: "https://github.com/shanebrownescope/engr-science-teaching-resources",
      },
    ],
  }
]