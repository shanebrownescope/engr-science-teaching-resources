"use client";
import { redirect } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";

const DashboardPage = () => {
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    redirect("/unauthorized");
  }

  return (
    <div>
      <p> Admin page only </p>
    </div>
  );
};

export default DashboardPage;
