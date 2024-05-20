"use server";

import { redirect } from "next/navigation";

import {
  DEFAULT_LOGIN_REDIRECT, 
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes"
import { auth } from "@/auth";
import { headers } from "next/headers";

const requireAuth = async () => {
  const session = await auth();
  const isLoggedIn = !!session;

  if (!isLoggedIn) {
    redirect("/auth/login");
  } 

  return
};

export default requireAuth;
