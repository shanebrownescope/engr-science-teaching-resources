"use client"
import { Group, Code, ScrollArea, rem, Burger, Button, Divider, Drawer, UnstyledButton, Center, Box, Collapse } from '@mantine/core';
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
  IconChevronDown,
} from '@tabler/icons-react';
// import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from './NavbarLinksGroup';
// import { Logo } from './Logo';
import classes from './NavbarNested.module.css';
import { useDisclosure } from '@mantine/hooks';

const mockdataDesktop = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Upload resource',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Files', link: '/dashboard/upload-file' },
      { label: 'Links', link: '/dashboard/upload-link' },
    ],
  },
  {
    label: 'Add content',
    icon: IconCalendarStats,
    initiallyOpened: true,
    links: [
      { label: 'Courses', link: '/dashboard/courses' },
      { label: 'Course Topics', link: '/dashboard/course-topics' },
      { label: 'Resource Types', link: '/dashboard/resource-types' },
      { label: 'Concepts', link: '/dashboard/concepts' },
    ],
  },
  { label: 'Registration Requests',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Pending Users', link: '/dashboard/pending-users' },
    ]
  },
];


export function NavbarNested() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = 
    useDisclosure(false);

  const linksDesktop = mockdataDesktop.map((item) => <LinksGroup {...item} key={item.label} />);


  return (
    <div className={classes.sidebarContainer}> 
      <Burger
        opened={drawerOpened}
        onClick={toggleDrawer}
        hiddenFrom="sm"
      />

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Admin Menu"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          {linksDesktop}

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