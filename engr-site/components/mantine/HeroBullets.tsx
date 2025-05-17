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
  const instructionData = [
    {
      icon: IconSearch,
      title: 'Search for Resources',
      description:
        'Use the search bar above to find teaching materials by entering keywords related to your topic of interest.',
    },
    {
      icon: IconNotebook,
      title: 'Access Resources',
      description:
        'Select any resource to view details, download materials, and see related concepts and topics.',
    },
    {
      icon: IconMessage,
      title: 'Share Your Feedback',
      description:
        'Help the community by leaving reviews on resources you\'ve used in your teaching.',
    },
    {
      icon: IconShare,
      title: 'Contribute',
      description:
        'Have materials to share? Fill out our request form to contribute your own learning resources to the repository.',
    },
  ];

  const instructionItems = instructionData.map((item, index) => (
    <div key={index} className={classes.instructionStep}>
      <ThemeIcon size={44} radius="md" className={classes.instructionIcon}>
        <item.icon size={24} stroke={1.5} />
      </ThemeIcon>
      <Box ml="md">
        <Text fw={500} fz="lg" mb={7}>
          {index + 1}. {item.title}
        </Text>
        <Text c="dimmed" fz="sm">
          {item.description}
        </Text>
      </Box>
    </div>
  ));

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
      
      {/* Instructions Section */}
      <div className={classes.instructionsContainer}>
        <Title order={2} className={classes.instructionsTitle}>
          How to Use E-SCoPe
        </Title>
        
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30} mt={30}>
          {instructionItems}
        </SimpleGrid>
      </div>
    </Container>
  );
}