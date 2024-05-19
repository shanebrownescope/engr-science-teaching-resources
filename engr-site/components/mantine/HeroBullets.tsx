"use client";
import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import image from "./image.svg";
import classes from "./HeroBullets.module.css";

export function HeroBullets() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Find teaching material{" "}
            <span className={classes.highlight}>fast</span>
          </Title>
          <Text c="dimmed" mt="md">
            Teaching a new class is an extremely daunting task. You have to
            scurry to create quality teaching material while coming up with
            useful homework, practice exercises, and quality exams. We've put
            together this website to ease the stress of teaching a new class by
            creating a place where you can find nearly all of the material
            required to effectively teach your class!
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Comprehensive Lesson Plans</b> – Access detailed and adaptable
              lesson plans for a variety of courses
            </List.Item>
            <List.Item>
              <b>Homework and Practice Exercises</b> – Find a wide range of
              homework assignments and practice exercises to reinforce classroom
              learning
            </List.Item>
            <List.Item>
              <b>Quality Exam Resources</b> – Utilize extensive collection of
              quizzes, tests, and exam prep materials
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control}>
              Get started
            </Button>
            {/* <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Source code
            </Button> */}
          </Group>
        </div>
        <Image src={image.src} className={classes.image} />
      </div>
    </Container>
  );
}
