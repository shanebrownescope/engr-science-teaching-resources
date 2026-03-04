"use client";
import { useState, useEffect } from "react";

import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { FormattedData } from "@/utils/formatting";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useRouter } from "next/navigation";
import { FileUpload } from "../../_components/FileUpload";
import { useSession } from "next-auth/react";

const UploadFile = () => {
  const { status } = useSession();
  const role = useCurrentRole();
  const router = useRouter();

  const [coursesOptionsData, setCoursesOptionsData] = useState<FormattedData[] | undefined>();

  useEffect(() => {
    if (status === "authenticated" && role !== "admin" && role !== "instructor") {
      console.log("-- not admin or instructor, redirecting");
      router.push("/unauthorized");
    }
  }, [status, role, router]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      const fetchedCourses = await fetchCourses();
      if (fetchedCourses.success) {
        console.log("success: ", fetchedCourses.success);
        setCoursesOptionsData(fetchedCourses.success);
      }
    };

    fetchAllCourses();
  }, []);

  if (status === "loading" || (status === "authenticated" && role !== "admin" && role !== "instructor")) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FileUpload coursesOptionsData={coursesOptionsData} />
    </div>
  );
};

export default UploadFile;
