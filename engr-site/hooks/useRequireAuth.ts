"use client";

import requireAuth from "@/actions/auth/requireAuth";
import { useEffect, useState } from "react";

export const useRequireAuth = () => {
  useEffect(() => {
    const handleAuth = async () => {
      await requireAuth();
    };

    handleAuth();
  }, []);
};
