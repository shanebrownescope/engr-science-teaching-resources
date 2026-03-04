"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button, Modal, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { deleteLinkAction } from "@/actions/delete/deleteLink";
import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteLinkButtonProps = {
    linkId: number;
    uploadedUserId: number;
};

export const DeleteLinkButton = ({ linkId, uploadedUserId }: DeleteLinkButtonProps) => {
    const user = useCurrentUser();
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Check if user has permission to delete this link
    const canDelete = user?.role === "admin" || user?.id === String(uploadedUserId);

    if (!canDelete) {
        return null;
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteLinkAction(linkId);
            if (result.error) {
                console.error("Failed to delete link:", result.error);
                alert(result.error);
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
            close();
        }
    };

    return (
        <>
            <Button
                color="red"
                variant="light"
                leftSection={<IconTrash size={16} />}
                onClick={open}
                size="xs"
            >
                Delete Link
            </Button>

            <Modal opened={opened} onClose={close} title="Confirm Deletion" centered>
                <Text size="sm" mb="md">
                    Are you sure you want to delete this link? This action cannot be undone.
                </Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={close} disabled={loading}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={handleDelete} loading={loading}>
                        Delete
                    </Button>
                </Group>
            </Modal>
        </>
    );
};
