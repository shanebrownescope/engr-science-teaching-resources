import { Button, Card, Group, Text, Badge, Stack, Divider } from "@mantine/core";

type PendingUserDetailsProps = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: string;
  handleApprove: () => void;
  handleReject: () => void;
};

/**
 * Renders the pending user details.
 *
 * @param {PendingUserDetailsProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered PendingUserDetails component.
 */
export const PendingUserDetails = ({
  firstName,
  lastName,
  email,
  username,
  status,
  handleApprove,
  handleReject,
}: PendingUserDetailsProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
      <Stack gap="xs">
        <Text fw={500} size="lg">
          {firstName} {lastName}
        </Text>
        
        <Group justify="apart">
          <Text size="sm" c="dimmed">Email:</Text>
          <Text size="sm">{email}</Text>
        </Group>
        
        <Group justify="apart">
          <Text size="sm" c="dimmed">Username:</Text>
          <Text size="sm" fw={500}>{username}</Text>
        </Group>
        
        <Group justify="apart">
          <Text size="sm" c="dimmed">Status:</Text>
          <Badge color={status === "pending" ? "yellow" : "blue"}>
            {status}
          </Badge>
        </Group>
        
        <Divider my="sm" />
        
        <Group justify="right" gap="md">
          <Button 
            color="green" 
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button 
            color="red" 
            onClick={handleReject}
            variant="filled"
          >
            Reject
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};
