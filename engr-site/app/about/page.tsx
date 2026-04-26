"use client";
import React from "react";
import {
  GuestHeaderMegaMenu,
} from "@/components/mantine";
import Footer from "@/components/custom/footer/Footer";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Card,
  ThemeIcon,
  Badge,
  Image,
  Flex,
  Box,
  List,
} from "@mantine/core";
import {
  IconSearch,
  IconUsersGroup,
  IconStar,
  IconBrowserCheck,
  IconBrandGithub
} from "@tabler/icons-react";
import classes from "./page.module.css";
import Link from "next/link";
import "@mantine/core/styles.css";

const currentTeam = [
  {
    name: "Shane Brown",
    role: "Sponsor",
    status: "Professor and Associate Head of Graduate Affairs | School of CCE at Oregon State University",
  },
  {
    name: "Jeffrey Knowles",
    role: "Sponsor",
    status: "Assistant Professor of Teaching | School of CCE at Oregon State University",
  },
  {
    name: "Jennifer Ceballos",
    role: "Role",
    status: "School of EECS at Oregon State University",
  },
  {
    name: "Diego Diaz-Diaz",
    role: "Role",
    status: "School of EECS at Oregon State University",
  },
  {
    name: "Samuel Richards",
    role: "Role",
    status: "School of EECS at Oregon State University",
  },
  {
    name: "Ryan Shankar",
    role: "Role",
    status: "School of EECS at Oregon State University",
  },
  {
    name: "Daniel Thien",
    role: "Role",
    status: "School of EECS at Oregon State University",
  }
];

const pastContributors = [
  {
    name: "Jacob Beitler",
    role: "Full-Stack Developer",
    status: "Past Contributor | School of EECS at Oregon State University",
  },
  {
    name: "Jonah Cadiz",
    role: "Full-Stack Developer",
    status: "Past Contributor | School of EECS at Oregon State University",
  },
  {
    name: "Eebbaa Felema",
    role: "Full-Stack Developer",
    status: "Past Contributor | School of EECS at Oregon State University",
  },
  {
    name: "Jim Huang",
    role: "Full-Stack Developer",
    status: "Past Contributor | School of EECS at Oregon State University",
  },
  {
    name: "Zhenghui Yin",
    role: "Full-Stack Developer",
    status: "Past Contributor | School of EECS at Oregon State University",
  },
  {
    name: "Joseph Babal",
    role: "Full-Stack Developer",
    status: "Past Contributor | School of EECS at Oregon State University",
  },
  {
    name: "John Nguyen",
    role: "Full-Stack Developer",
    status: "Past Contributor | School of EECS at Oregon State University",
  }
];

const features = [
  {
    title: "Curated Resource Discovery",
    description: "Browse categorized materials seamlessly so you can spend less time searching and more time teaching.",
    icon: IconSearch,
  },
  {
    title: "Community Ratings",
    description: "Identify the best resources quickly through our integrated rating system driven by real educators.",
    icon: IconStar,
  },
  {
    title: "Collaborative Sharing",
    description: "Upload and share your own successful teaching materials securely with the entire academic community.",
    icon: IconUsersGroup,
  },
];

export default function AboutPage() {
  return (
    <div>
      <GuestHeaderMegaMenu />

      {/* 1. Project Description & Value Proposition */}
      <section className={classes.hero}>
        <Container size="lg">
          <Badge variant="filled" color="blue" size="lg" mb="md">
            The E-SCoPe Project
          </Badge>
          <Title className={classes.title}>
            Connecting educators through a community-driven repository of premium teaching materials.
          </Title>
          <Text className={classes.description} c="white">
            Educators often lack a unified platform to discover, rate, and share high-quality, practical learning materials.
            E-SCoPe solves this fragmented experience by providing an intuitive, centralized hub designed specifically for academic resource sharing.
          </Text>
          <br />
          <Text className={classes.description} fw={500} c="white">
            Our platform empowers instructors to elevate their teaching effectiveness by easily leveraging and contributing to a collective library of proven educational assets.
          </Text>
        </Container>
      </section>

      {/* 2. Key Features or Highlights */}
      <section className={classes.section}>
        <Container size="lg">
          <Title ta="center" className={classes.sectionTitle}>Key Platform Features</Title>
          <Text ta="center" mx="auto" className={classes.sectionDescription}>
            Designed from the ground up to streamline how educators access, evaluate, and share their best materials.
          </Text>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mb="xl">
            {features.map((feature) => (
              <Card key={feature.title} shadow="sm" radius="md" className={classes.card} padding="xl">
                <ThemeIcon size={50} radius="md" variant="light" color="blue">
                  <feature.icon size={26} stroke={1.5} />
                </ThemeIcon>
                <Text fz="lg" fw={700} className={classes.cardTitle} mt="md">
                  {feature.title}
                </Text>
                <Text fz="sm" c="dimmed" mt="sm">
                  {feature.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>

          {/* Screenshot / Media Requirement */}
          <Box mt={50}>
            <Title order={3} ta="center" mb="lg">E-SCoPe in Action</Title>
            <Card shadow="md" radius="lg" p={0} withBorder>
              <Image
                src="/overview.jpeg"
                alt="A full overview of the E-SCoPe dashboard and material catalog interface."
              />
            </Card>
          </Box>
        </Container>
      </section>

      {/* 3. How to Access or Try It */}
      <section className={classes.ctaSection}>
        <Container size="md">
          <Title ta="center" className={classes.ctaTitle}>Ready to improve your teaching toolkit?</Title>
          <Text ta="center" mx="auto" className={classes.ctaDescription}>
            Join the community today and start discovering top-tier learning resources.
          </Text>

          <Group justify="center">
            <Link href="/auth/register">
              <Button size="lg" variant="white" color="dark" radius="md">
                Try E-SCoPe Now
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" color="gray.3" radius="md">
                Log In
              </Button>
            </Link>
          </Group>

          <Box className={classes.prereqsBox}>
            <Title order={4} mb="md" c="white">Requirements & Prerequisites</Title>
            <List spacing="sm" size="sm" center icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconBrowserCheck size={16} />
              </ThemeIcon>
            }>
              <List.Item>
                <Text c="gray.3"><b>Platform:</b> Accessible from any modern desktop or mobile web browser.</Text>
              </List.Item>
              <List.Item>
                <Text c="gray.3"><b>Setup:</b> No downloads required. Simply create an account using your email address.</Text>
              </List.Item>
            </List>
          </Box>
        </Container>
      </section>

      {/* 4. Team Credits */}
      <section className={classes.teamWrapper}>
        <Container size="lg">
          <Group justify="center" mb="xs">
            <Badge variant="filled" size="lg" color="indigo">
              Team Credits
            </Badge>
          </Group>
          <Title ta="center" className={classes.sectionTitle}>Current Team</Title>
          <Text ta="center" mx="auto" className={classes.sectionDescription}>
            E-SCoPe is a multi-year project proudly brought to you by students and faculty from Oregon State University.
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="xl">
            {currentTeam.map((member, idx) => (
              <Card key={`${member.name}-${idx}`} shadow="xs" radius="md" className={classes.teamCard} padding="lg">
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fz="lg" fw={600}>
                      {member.name}
                    </Text>
                    <Text fz="xs" c="dimmed" mt={4}>
                      {member.status}
                    </Text>
                  </Box>
                  <Badge
                    className={classes.roleBadge}
                    variant="light"
                    color={member.role === "Sponsor" ? `orange` : "blue"}
                  >
                    {member.role}
                  </Badge>
                </Flex>
              </Card>
            ))}
          </SimpleGrid>

          <Title order={3} ta="center" mt={40} mb="lg">Past Contributors</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {pastContributors.map((member, idx) => (
              <Card key={`${member.name}-${idx}`} shadow="xs" radius="md" className={classes.teamCard} padding="lg">
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fz="lg" fw={600}>
                      {member.name}
                    </Text>
                    <Text fz="xs" c="dimmed" mt={4}>
                      {member.status}
                    </Text>
                  </Box>
                  <Badge
                    className={classes.roleBadge}
                    variant="light"
                    color="gray"
                  >
                    {member.role}
                  </Badge>
                </Flex>
              </Card>
            ))}
          </SimpleGrid>

          <Box mt={60} ta="center">
            <Title order={4} mb="xs">Feedback & Questions</Title>
            <Text c="dimmed" mb="md">Experiencing issues or want to provide feedback?</Text>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Button leftSection={<IconBrandGithub size={18} />} variant="default" radius="md">
                Open an Issue on GitHub
              </Button>
            </a>
          </Box>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
