"use client";
import React from "react";
import { Container, Title, Text, Card, Center, Badge, Group, Stack, rem, SimpleGrid } from "@mantine/core";
import {
  IconBrandReact,
  IconBrandMantine,
  IconBrandNextjs,
  IconBrandNodejs,
  IconDatabase,
  IconCloud,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import classes from "./TechnologyOverview.module.css";

const techStack = [
  {
    category: "Frontend",
    color: "blue",
    technologies: [
      {
        name: "React.js",
        description: "Frontend library for building interactive UIs",
        icon: <IconBrandReact size={32} />,
        iconColor: "#61DAFB"
      },
      {
        name: "Mantine",
        description: "Modern React component library",
        icon: <IconBrandMantine size={32} />,
        iconColor: "#339AF0"
      }
    ]
  },
  {
    category: "Backend",
    color: "orange",
    technologies: [
      {
        name: "Next.js",
        description: "Fullstack framework with server-side rendering",
        icon: <IconBrandNextjs size={32} />,
        iconColor: "#000000"
      },
      {
        name: "Node.js",
        description: "JavaScript runtime environment for servers",
        icon: <IconBrandNodejs size={32} />,
        iconColor: "#68A063"
      }
    ]
  },
  {
    category: "Cloud",
    color: "yellow",
    technologies: [
      {
        name: "AWS RDS",
        description: "Managed relational database service",
        icon: <IconDatabase size={32} />,
        iconColor: "#4479A1"
      },
      {
        name: "AWS S3",
        description: "Scalable object storage for files",
        icon: <IconCloud size={32} />,
        iconColor: "#FF9900"
      }
    ]
  }
];

export function TechnologyOverview() {
  return (
    <div className={classes.wrapper}>
      <Container size="lg" py="xl">
        <Group justify="center">
          <Badge variant="filled" size="lg" color="indigo">
            Technology Stack & Architecture
          </Badge>
        </Group>

        <Title order={2} className={classes.title} ta="center" mt="sm">
          Integrated Fullstack Solution
        </Title>

        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          Seamless flow between modern technologies with bidirectional data exchange
        </Text>

        {/* Combined Architecture Flow */}
        <div className={classes.architectureFlow}>
          {techStack.map((stack, index) => (
            <React.Fragment key={stack.category}>
              {index > 0 && (
                <div className={classes.bidirectionalArrow}>
                  <IconArrowLeft className={classes.arrowIcon} />
                  <IconArrowRight className={classes.arrowIcon} />
                </div>
              )}
              
              <Card className={classes.stackCard} radius="lg">
                <Badge
                  variant="light"
                  color={stack.color}
                  size="lg"
                  mb="sm"
                  className={classes.stackBadge}
                >
                  {stack.category}
                </Badge>
                <div className={classes.techGrid}>
                  {stack.technologies.map((tech) => (
                    <div key={tech.name} className={classes.techItem}>
                      <Center>
                        <div className={classes.techIcon} style={{ color: tech.iconColor }}>
                          {tech.icon}
                        </div>
                      </Center>
                      <Text fz="sm" fw={500} ta="center" mt={4}>
                        {tech.name}
                      </Text>
                      <Text fz="xs" c="dimmed" ta="center" mt={2} className={classes.techDescription}>
                        {tech.description}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            </React.Fragment>
          ))}
        </div>
      </Container>
    </div>
  );
}