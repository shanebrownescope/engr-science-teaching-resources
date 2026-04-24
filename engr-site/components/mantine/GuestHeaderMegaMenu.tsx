"use client";

import { Group, Button, Divider, Box, Burger, Drawer, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import classes from "./GuestHeaderMegaMenu.module.css";
import Link from "next/link";

/**
 * Renders a nav bar for the landing page.
 *
 * @returns {JSX.Element} - The rendered GuestHeaderMegaMenu component.
 */
export function GuestHeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/" className="site-logo"> E-SCoPe</Link>

          <Group visibleFrom="sm">
            <Link href="/auth/login">
              <Button variant="default">Log in</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign up</Button>
            </Link>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

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
          <span style={{ fontWeight: 600 }}>Navigation</span>
          <ActionIcon onClick={closeDrawer} variant="subtle" size="lg">
            <IconX size={18} />
          </ActionIcon>
        </Group>

        <Divider mb="sm" />

        <Group justify="center" grow pb="xl">
          <Link href="/auth/login" onClick={closeDrawer}>
            <Button variant="default" fullWidth>Log in</Button>
          </Link>
          <Link href="/auth/register" onClick={closeDrawer}>
            <Button fullWidth>Sign up</Button>
          </Link>
        </Group>
      </Drawer>
    </Box>
  );
}
