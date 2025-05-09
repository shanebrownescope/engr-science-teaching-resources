"use client";

import { useState, useEffect } from "react";
import { Table, Button, Group, Text, Badge, Container, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { fetchExternalRequests } from "@/actions/fetching/requests/fetchExternalRequests";
import { approveExternalRequest, rejectExternalRequest } from "@/actions/requests/manageRequests";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type ExternalRequest = {
  id: number;
  name: string;
  email: string;
  courseId: number;
  courseName: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

const PendingRequestsPage = () => {
  useRequireAuth();
  const router = useRouter();
  const role = useCurrentRole();
  
  const [requests, setRequests] = useState<ExternalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Check user permissions
  if (role !== "admin") {
    console.log("-- Non-admin user");
    router.push("/unauthorized");
  }

  // Fetch external request data
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const result = await fetchExternalRequests();
        if (result.success) {
          setRequests(result.success);
        } else if (result.failure) {
          setError(result.failure);
        }
      } catch (err) {
        setError("Error fetching request data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  // Handle approve request
  const handleApprove = async (id: number) => {
    try {
      setProcessingId(id);
      const result = await approveExternalRequest(id);
      if (result.success) {
        // Update local state
        setRequests(requests.map(req => 
          req.id === id ? { ...req, status: "approved" } : req
        ));
      } else {
        setError(result.error || "Failed to approve request");
      }
    } catch (err) {
      setError("Error processing request");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject request
  const handleReject = async (id: number) => {
    try {
      setProcessingId(id);
      const result = await rejectExternalRequest(id);
      if (result.success) {
        // Update local state
        setRequests(requests.map(req => 
          req.id === id ? { ...req, status: "rejected" } : req
        ));
      } else {
        setError(result.error || "Failed to reject request");
      }
    } catch (err) {
      setError("Error processing request");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "green";
      case "rejected": return "red";
      default: return "yellow";
    }
  };

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Pending Request Forms</Title>
      
      {error && (
        <Text color="red" mb="md">{error}</Text>
      )}
      
      {loading ? (
        <Text>Loading...</Text>
      ) : requests.length === 0 ? (
        <Text>No pending requests</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Course</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Submission Time</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((request) => (
              <Table.Tr key={request.id}>
                <Table.Td>{request.name}</Table.Td>
                <Table.Td>{request.email}</Table.Td>
                <Table.Td>{request.courseName}</Table.Td>
                <Table.Td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {request.description}
                </Table.Td>
                <Table.Td>{new Date(request.createdAt).toLocaleDateString()}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(request.status)}>
                    {request.status === "pending" ? "Pending" : 
                     request.status === "approved" ? "Approved" : "Rejected"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group>
                    <Button 
                      size="xs" 
                      color="green" 
                      onClick={() => handleApprove(request.id)}
                      loading={processingId === request.id}
                      disabled={request.status !== "pending"}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="xs" 
                      color="red" 
                      onClick={() => handleReject(request.id)}
                      loading={processingId === request.id}
                      disabled={request.status !== "pending"}
                    >
                      Reject
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  );
};

export default PendingRequestsPage;