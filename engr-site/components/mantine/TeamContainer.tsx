"use client";
import { Container, Title, Text, SimpleGrid, Card, Avatar, Group, Badge, Flex, Box } from "@mantine/core";
import classes from "./TeamContainer.module.css";

const teamMembers = [
  {
    name: "Jacob Beitler",
    role: "Full-Stack Developer",
    education: "Senior undergrad | School of EECS at Oregon State University",
  },
  {
    name: "Jonah Cadiz",
    role: "Full-Stack Developer",
    education: "Senior undergrad | School of EECS at Oregon State University",
  },
  {
    name: "Eebbaa Felema",
    role: "Full-Stack Developer",
    education: "Senior undergrad | School of EECS at Oregon State University",
  },
  {
    name: "Jim Huang",
    role: "Full-Stack Developer",
    education: "Senior undergrad | School of EECS at Oregon State University",
  },
  {
    name: "Zhenghui Yin",
    role: "Full-Stack Developer",
    education: "Senior undergrad | School of EECS at Oregon State University",
  },
  {
    name: "Joseph Babal",
    role: "Full-Stack Developer",
    education: "Graduated | School of EECS at Oregon State University",
  },
  {
    name: "John Nguyen",
    role: "Full-Stack Developer",
    education: "Graduated | School of EECS at Oregon State University",
  }
];

export function TeamContainer() {
  return (
    <Container size="lg" py="xl" className={classes.wrapper}>
      <Group justify="center">
        <Badge variant="filled" size="lg" color="indigo">
          Our Team
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Meet the Developers
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Senior undergraduate students from Oregon State University's School of EECS
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl" mt={50}>
        {teamMembers.map((member) => (
          <Card key={member.name} shadow="md" radius="md" className={classes.card} padding="lg">
            <Flex gap="md" align="flex-start">
              <Box>
                <Flex align="center" gap="sm" mb={4}>
                  <Text fz="lg" fw={600}>
                    {member.name}
                  </Text>
                  <Badge variant="light" color="blue" size="sm">
                    {member.role}
                  </Badge>
                </Flex>
                
                <Text fz="sm" c="dimmed">
                  {member.education}
                </Text>
              </Box>
            </Flex>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}