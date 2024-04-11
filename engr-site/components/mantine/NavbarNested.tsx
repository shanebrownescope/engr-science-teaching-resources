"use client"
import { Group, Code, ScrollArea, rem } from '@mantine/core';
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from '@tabler/icons-react';
// import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from './NavbarLinksGroup';
// import { Logo } from './Logo';
import classes from './NavbarNested.module.css';

const mockdata = [
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
      { label: 'Modules', link: '/dashboard/modules' },
      { label: 'Sections', link: '/dashboard/sections' },
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
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <div className={classes.navbar}>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      {/* <div className={classes.footer}>
        <UserButton />
      </div> */}
    </div>
  );
}