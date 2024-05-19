import { Text, Title, TextInput, Button, Image, Center } from "@mantine/core";
import image from "./image2.svg";
import classes from "./EmailBanner.module.css";

export function EmailBanner() {
  return (
    <div className={classes.wrapper}>
      <Center className={classes.body}>
        <div className={classes.content}>
          <Title className={classes.title}>Wait a minute...</Title>
          <Text fw={500} fz="lg" mb={5}>
            Subscribe to our newsletter!
          </Text>
          <Text fz="sm" c="dimmed">
            You will never miss important website updates.
          </Text>

          <div className={classes.controls}>
            <TextInput
              placeholder="Your email"
              classNames={{ input: classes.input, root: classes.inputWrapper }}
            />
            <Button className={classes.control}>Subscribe</Button>
          </div>
        </div>
      </Center>
      <Image src={image.src} className={classes.image} />
    </div>
  );
}
