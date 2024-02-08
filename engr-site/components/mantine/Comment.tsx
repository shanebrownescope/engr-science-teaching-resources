import {
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
} from "@mantine/core";
import classes from "./Comment.module.css";

export function Comment() {
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
          alt="Jacob Warnhalter"
          radius="xl"
        />
        <div>
          <Text fz="sm">John Doe</Text>
          <Text fz="xs" c="dimmed">
            10 minutes ago
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider className={classes.body}>
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{
            __html:
              "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec efficitur dolor a quam ultrices feugiat. Sed sed purus tortor. In tincidunt justo non felis facilisis, non ultricies dui blandit. Fusce laoreet a nibh et bibendum. Nunc nunc nulla, eleifend ut arcu nec, dictum efficitur lectus. In at nunc magna. Duis a risus arcu. Etiam aliquet erat rutrum ante iaculis, in convallis nulla porttitor.</p>",
          }}
        />
      </TypographyStylesProvider>
    </Paper>
  );
}
