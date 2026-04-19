//* signout with next.auth on server
import { signOut } from "@/auth";
import { getCurrentUser } from "@/utils/authHelpers";
import styles from "./profile.module.css";
import requireAuth from "@/actions/auth/requireAuth";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconMail, IconShieldHalf, IconUser } from "@tabler/icons-react";
import { fetchUploadsByUserId } from "@/actions/fetching/uploads/fetchUploadsByUserId";
import { UploadedItemsList } from "./_components/UploadedItemsList";
import { getAvatarColor } from "@/utils/helpers";

const Profile = async () => {
  await requireAuth();

  const user = await getCurrentUser();

  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  const canViewUploads = user?.role === "admin" || user?.role === "instructor";

  const uploads =
    canViewUploads && user?.id
      ? await fetchUploadsByUserId(user.id)
      : null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const avatarColor = user?.name ? getAvatarColor(user.name) : "blue";

  const roleColor =
    user?.role === "admin"
      ? "red"
      : user?.role === "instructor"
      ? "blue"
      : "gray";

  return (
    <div className={styles.container}>
      <Paper withBorder radius="md" p="xl">
        <Group align="flex-start" gap="xl" wrap="nowrap">
          <Avatar color={avatarColor} size={80} radius="xl">
            {initials}
          </Avatar>

          <Stack gap="xs" style={{ flex: 1 }}>
            <Group gap="sm" align="center">
              <Title order={2}>{user?.name}</Title>
              <Badge color={roleColor} variant="light">
                {user?.role}
              </Badge>
            </Group>

            <Divider />

            <Group gap="xs">
              <IconMail size={16} color="gray" />
              <Text size="sm" c="dimmed">
                {user?.email}
              </Text>
            </Group>

            <Group gap="xs">
              <IconUser size={16} color="gray" />
              <Text size="sm" c="dimmed">
                {user?.name}
              </Text>
            </Group>

            {user?.role && (
              <Group gap="xs">
                <IconShieldHalf size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Text>
              </Group>
            )}
          </Stack>
        </Group>

        <form action={handleSignOut} style={{ marginTop: "1.5rem" }}>
          <Button type="submit" variant="light" color="red">
            Sign out
          </Button>
        </form>
      </Paper>

      {canViewUploads && uploads?.success && (
        <UploadedItemsList
          files={uploads.success.files}
          links={uploads.success.links}
        />
      )}
    </div>
  );
};

export default Profile;
