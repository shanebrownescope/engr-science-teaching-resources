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
  NavLink,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBolt,
  IconBarbell,
  IconArrowsMove,
  IconChevronDown,
  IconAtom,
} from "@tabler/icons-react";
import classes from "./HeaderMegaMenu.module.css";
import Link from "next/link";

const mockdata = [
  {
    icon: IconAtom,
    title: "Statics",
    description: "Description goes here",
  },
  {
    icon: IconArrowsMove,
    title: "Dynamics",
    description: "Description goes here",
  },
  {
    icon: IconBarbell,
    title: "Strengths of Materials",
    description: "Description goes here",
  },
  {
    icon: IconBolt,
    title: "Circuits & Electrical Fundamentals",
    description: "Description goes here",
  },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  // const links = mockdata.map((item) => (
  //   <UnstyledButton className={classes.subLink} key={item.title}>
  //     <NavLink
  //       href=""
  //       label="With icon"
  //       leftSection={<IconHome2 size="1rem" stroke={1.5} />}
  //     >
  //       <Group wrap="nowrap" align="flex-start">
  //         <ThemeIcon size={34} variant="default" radius="md">
  //           <item.icon
  //             style={{ width: rem(22), height: rem(22) }}
  //             color={theme.colors.blue[6]}
  //           />
  //         </ThemeIcon>
  //         <div>
  //           <Text size="sm" fw={500}>
  //             {item.title}
  //           </Text>
  //           <Text size="xs" c="dimmed">
  //             {item.description}
  //           </Text>
  //         </div>
  //       </Group>
  //     </NavLink>
  //   </UnstyledButton>
  // ));

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* <MantineLogo size={30} /> */}
          <h3>Engineering Resources</h3>

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="#" className={classes.link}>
              Home
            </a>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Courses
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Courses</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

                {/* <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid> */}

                {/* <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div> */}
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="#" className={classes.link}>
              What we offer
            </a>
            <a href="#" className={classes.link}>
              Acknowledgments
            </a>
          </Group>

          <Group visibleFrom="sm">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
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

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          {/* <Collapse in={linksOpened}>{links}</Collapse> */}
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
