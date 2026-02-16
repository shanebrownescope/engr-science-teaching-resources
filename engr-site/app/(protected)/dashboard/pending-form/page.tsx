"use client";

import { useState, useEffect } from "react";
import { Container, Title, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const PendingFormPage = () => {
  useRequireAuth();
  const router = useRouter();
  const role = useCurrentRole();
  
  // Check user permissions
  if (role !== "admin") {
    console.log("-- Non-admin user");
    router.push("/unauthorized");
  }

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Pending Forms</Title>
      <Text>Pending form content will be displayed here.</Text>
    </Container>
  );
};

export default PendingFormPage;