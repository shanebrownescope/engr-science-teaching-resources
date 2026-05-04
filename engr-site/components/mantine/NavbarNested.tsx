"use client";
import {
  ScrollArea,
  rem,
  Burger,
  Divider,
  Drawer,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
} from "@tabler/icons-react";
// import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from "./NavbarLinksGroup";
// import { Logo } from './Logo';
import classes from "./NavbarNested.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useCurrentRole } from "@/hooks/useCurrentRole";

const allNavData = [
  { label: "Dashboard", icon: IconGauge, roles: ["admin", "instructor"] },
  {
    label: "Upload resource",
    icon: IconNotes,
    initiallyOpened: true,
    roles: ["admin", "instructor"],
    links: [
      { label: "Files", link: "/dashboard/upload-file" },
      { label: "Links", link: "/dashboard/upload-link" },
    ],
  },
  {
    label: "Add Content",
    icon: IconCalendarStats,
    initiallyOpened: true,
    roles: ["admin"],
    links: [
      { label: "Courses", link: "/dashboard/courses" },
      { label: "Course Topics", link: "/dashboard/course-topics" },
      { label: "Resource Types", link: "/dashboard/resource-types" },
      { label: "Concepts", link: "/dashboard/concepts" },
      { label: "Manage Courses", link: "/courses/manage" },
    ],
  },
  {
    label: "Registration Requests",
    icon: IconNotes,
    initiallyOpened: true,
    roles: ["admin"],
    links: [
      { label: "Pending Users", link: "/dashboard/pending-users" },
      { label: "Pending Request Forms", link: "/dashboard/pending-requests" }
    ],
  },
];

/**
 * Renders a nested navigation bar.
 *
 * @returns {JSX.Element} - The rendered NavbarNested component.
 */
export function NavbarNested() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const role = useCurrentRole();

  const navData = allNavData.filter((item) =>
    item.roles.includes(role ?? "")
  );

  const linksDesktop = navData.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  const linksMobile = navData.map((item) => (
    <LinksGroup {...item} key={item.label} onLinkClick={closeDrawer} />
  ));

  return (
    <div className={classes.sidebarContainer}>
      <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        withCloseButton={false}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Group justify="space-between" mb="sm">
          <span style={{ fontWeight: 600 }}>Admin Menu</span>
          <ActionIcon onClick={closeDrawer} variant="subtle" size="lg">
            <IconX size={18} />
          </ActionIcon>
        </Group>

        <ScrollArea h={`calc(100vh - ${rem(80)})`}>
          <Divider my="sm" />

          {linksMobile}
        </ScrollArea>
      </Drawer>

      <div className={classes.desktopSidebar}>
        <div className={classes.navbar}>
          <ScrollArea className={classes.links}>
            <div className={classes.linksInner}>{linksDesktop}</div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
