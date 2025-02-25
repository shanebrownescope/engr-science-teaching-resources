"use client";
import { useState, useEffect } from "react";

import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { FormattedData } from "@/utils/formatting";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { notFound, redirect } from "next/navigation";
import { FileUpload } from "../../_components/FileUpload";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const UploadFile = () => {
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    redirect("/unauthorized");
    // notFound()
  }

  const [coursesOptionsData, setCoursesOptionsData] = useState<FormattedData[] | undefined>();
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

  return (
    <div>
      <FileUpload coursesOptionsData={coursesOptionsData} />
    </div>
  );
};

export default UploadFile;
