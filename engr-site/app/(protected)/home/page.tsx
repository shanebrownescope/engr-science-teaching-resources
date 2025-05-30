"use client";
import "@mantine/core/styles.css";
import { Container, Title, Text, Group, Badge, Space, Flex } from "@mantine/core";
import { FeaturesCards, GetInTouchSimple, InstructionsContainer, SearchButton } from "@/components/mantine";
import classes from "./home.module.css";
import requireAuth from "@/actions/auth/requireAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const Home = async () => {
  useRequireAuth()

  return (
    <div className={classes.wrapper}>
      <Flex className={classes.hero}>
        <Container size="lg">
          <Group justify="center">
            <Badge variant="filled" size="lg">
              Welcome to E-SCoPe
            </Badge>
          </Group>
          
          <Space h="md" />
          
          <Title order={1} ta="center" fw={700} className={classes.mainTitle}>
            Interactive Learning and Engagement Repository
          </Title>
          
          <Space h="xl" />
          
          <Text c="dimmed" className={classes.description} ta="center" maw={800} mx="auto">
            Discover ready-to-use active learning materials, share your best resources with colleagues, 
            and help shape the future of engaged education through our community-powered platform.
          </Text>

          <Container size="md" mt={50}>
            <SearchButton />
          </Container>
        </Container>
      </Flex>

      <Container size="lg" py={20} pt={0}>
        <InstructionsContainer />
      </Container>

      <Container size="lg" py={20}>
        <FeaturesCards />
      </Container>

      <GetInTouchSimple />
    </div>
  );
};

export default Home;