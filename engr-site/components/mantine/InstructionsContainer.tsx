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
import classes from "./InstructionsContainer.module.css";

/**
 * Renders a container for instructions.
 *
 * @returns {JSX.Element} - The rendered InstructionsContainer component.
 */
export function InstructionsContainer() {
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