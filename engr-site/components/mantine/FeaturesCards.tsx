import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  Container,
  rem,
  useMantineTheme,
  Image,
  Flex,
  Box,
} from "@mantine/core";
import { IconSearch, IconUpload, IconStar, IconSend } from "@tabler/icons-react";
import classes from "./FeaturesCards.module.css";

const features = [
  {
    title: "Discover Resources",
    description:
      "Powerful search tools to find exactly what you need by course, topic, or resource type. Filter by exercises, notes, videos, and interactive content.",
    icon: IconSearch,
    image: "/images/search.png",
  },
  {
    title: "Access Anytime",
    description:
      "Instant access to our entire resource library. Download materials or use them directly from our platform with seamless cloud syncing.",
    icon: IconUpload,
    image: "/images/access.png",
    reverse: true,
  },
  {
    title: "Rate & Review",
    description:
      "Community-driven quality ratings help you identify the best resources. See instructor feedback and student outcomes for each material.",
    icon: IconStar,
    image: "/images/review.png",
  },
  {
    title: "Share Resources",
    description:
      "Submit your best materials through our simple request form. Help build the repository while getting recognition for your contributions.",
    icon: IconSend,
    image: "/images/share.png",
    reverse: true,
  },
];

export function FeaturesCards() {
  const theme = useMantineTheme();

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <Group justify="center">
        <Badge variant="filled" size="lg">
          Brought to you by Oregon State University
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Interactive Learning & Engagement Repository
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Connecting educators through curated, community-rated learning materials
      </Text>

      <Box mt={50} className={classes.featuresContainer}>
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            shadow="sm"
            radius="lg"
            className={classes.featureCard}
            p={0}
          >
            <Flex
              direction={{ base: "column", md: feature.reverse ? "row-reverse" : "row" }}
              gap={0}
            >
              <Box p="xl" className={classes.textContent}>
                <feature.icon
                  style={{ width: rem(40), height: rem(40) }}
                  stroke={2}
                  color={theme.colors.blue[6]}
                  className={classes.featureIcon}
                />
                <Title order={3} className={classes.featureTitle} mt="sm">
                  {feature.title}
                </Title>
                <Text fz="md" mt="sm" className={classes.featureDescription}>
                  {feature.description}
                </Text>
              </Box>
              
              <Box className={classes.imageContainer}>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  height={300}
                  className={classes.featureImage}
                />
              </Box>
            </Flex>
          </Card>
        ))}
      </Box>
    </Container>
  );
}