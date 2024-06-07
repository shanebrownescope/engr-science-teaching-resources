"use client";
import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import { useDisclosure } from "@mantine/hooks";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconAtom,
  IconArrowsMove,
  IconBarbell,
  IconBolt,
} from "@tabler/icons-react";
import classes from "./HeaderMegaMenu.module.css";
import Link from "next/link";
import useFetchCourses from "@/hooks/useFetchCourses";
import { useCurrentRole } from "@/hooks/useCurrentRole";

const icons = [IconAtom, IconArrowsMove, IconBarbell, IconBolt];

/**
 * Renders a nav bar for the actual application.
 *
 * @returns {JSX.Element} - The rendered HeaderMegaMenu component.
 */
export function HeaderMegaMenu() {
  const role = useCurrentRole();

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const { data, error, loading } = useFetchCourses(4);

  const newData = data?.map((item, idx) => ({
    icon: icons[idx] ? icons[idx] : IconBook,
    title: item.name,
    url: item.url,
  }));

  const FinalCourseLinks = newData?.map((item, idx) => (
    <Link href={`/courses/${item.url}`} key={item.url} passHref>
      <UnstyledButton className={classes.subLink}>
        <Group wrap="nowrap" align="center">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon
              style={{ width: rem(22), height: rem(22) }}
              color={theme.colors.dark[8]}
            />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            {/* <Text size="xs" c="dimmed">
              {item?.description}
            </Text> */}
          </div>
        </Group>
      </UnstyledButton>
    </Link>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <div className="site-logo"> E-SCoPe</div>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/home" className={classes.link}>
              Home
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="/courses" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Courses
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.dark[8]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Courses</Text>
                  <Anchor href="/courses" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {FinalCourseLinks}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>

            {role === "admin" && (
              <Link href="/dashboard" className={classes.link}>
                Dashboard
              </Link>
            )}
          </Group>

          <Group visibleFrom="sm">
            <Link href={"/profile"}>
              <Button variant="default">Profile</Button>
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
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <a href="/" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Courses
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.dark[8]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{FinalCourseLinks}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
