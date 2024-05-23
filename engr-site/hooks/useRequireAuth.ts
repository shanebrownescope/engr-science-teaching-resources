"use client";

import requireAuth from "@/actions/auth/requireAuth";
import { useEffect, useState } from "react";


/**
 * Custom hook that requires authentication.
 *
 * This hook executes the `requireAuth` server action function asynchronously when the component using it mounts.
 * It ensures that the user is authenticated before allowing access to a protected route.
 *
 * @return {void} This hook does not return any value.
 */
export const useRequireAuth = () => {
  useEffect(() => {
    const handleAuth = async () => {
      await requireAuth();
    };

    handleAuth();
  }, []);
};
