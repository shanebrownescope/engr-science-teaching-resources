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
  SimpleGrid,
  Box,
} from "@mantine/core";
import { IconCheck, IconSearch, IconNotebook, IconMessage, IconShare } from "@tabler/icons-react";
import image from "./image.svg";
import classes from "./HeroBullets.module.css";

/**
 * Renders a hero section with bullets.
 *
 * @returns {JSX.Element} - The rendered HeroBullets component.
 */
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
            useful content, practice exercises, and engaging activities for students. 
            We've put together this website to ease the stress of teaching a new 
            class by creating a place where you can find nearly all of the material
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
              <b>Diverse Resource Types</b> – Access exercises, lecture notes, instructional videos, 
              and interactive content – all searchable by format and learning style
            </List.Item>
            <List.Item>
              <b>Course-Specific Materials</b> – Quickly find resources tailored to your 
              specific course curriculum and academic level
            </List.Item>
            <List.Item>
              <b>Community Reviews & Ratings</b> – See peer evaluations and instructor 
              reactions to resources before using them in your classroom
            </List.Item>
          </List>

          {/* <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control}>
              Get started
            </Button>
            <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Source code
            </Button>
          </Group> */}
        </div>
        <Image src={image.src} className={classes.image} />
      </div>
    </Container>
  );
}