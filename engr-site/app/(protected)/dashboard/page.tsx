"use client";
import { redirect } from "next/navigation";
import { FileUploadForm } from "../_components/FileUploadForm";
import { getCurrentUser } from "@/utils/authHelpers";
import { LinkUpload } from "../_components/LinkUpload";
import Link from "next/link";
import { NavbarNested } from "@/components/mantine/NavbarNested";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const DashboardPage = () => {
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    redirect("/unauthorized");
  }

  return (
    <div>
      <p> Admin page only </p>
      {/* <Link href={`/dashboard/upload-resource?${new URLSearchParams({
        type: "file"
      })}`}> Upload resource </Link> */}
      {/* <FileUploadForm /> */}
    </div>
  );
};

export default DashboardPage;
