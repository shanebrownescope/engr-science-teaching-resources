"use client";
import { Button, Container, Tooltip, useMantineTheme } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import classes from "./GetInTouchSimple.module.css";

export function GetInTouchSimple() {
  const handleClick = () => {
    const email = "escopeosu@gmail.com";
    window.location.href = `mailto:${email}?subject=Website Inquiry`;
  };

  return (
    <Container className={classes.container}>
      <Tooltip label="Contact Us" position="left" withArrow>
        <Button
          onClick={handleClick}
          className={classes.circularButton}
          radius={50}
          variant="filled"
          color="red"
        >
          <IconMail size={24} />
        </Button>
      </Tooltip>
    </Container>
  );
}