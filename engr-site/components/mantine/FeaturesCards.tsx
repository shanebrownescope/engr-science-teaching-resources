import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconNotebook, IconUser, IconNetwork } from "@tabler/icons-react";
import classes from "./FeaturesCards.module.css";

const mockdata = [
  {
    title: "Connect with others",
    description:
      "Connect with other instructors to share resources, ask questions, and get help.",
    icon: IconNetwork,
  },
  {
    title: "Privacy focused",
    description:
      "Only authenticated instructors can access the site. We don't sell your data to third parties. We don't even have ads!",
    icon: IconUser,
  },
  {
    title: "Quality resources",
    description:
      "All sorts of content from slides, to homework, to exams, to projects. We have it all!",
    icon: IconNotebook,
  },
];

export function FeaturesCards() {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge variant="filled" size="lg">
          Brought to you by Oregon State University
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        A community for instructors all around the country
      </Title>

      {/* <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Every once in a while, you’ll see a Golbat that’s missing some fangs.
        This happens when hunger drives it to try biting a Steel-type Pokémon.
      </Text> */}

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
