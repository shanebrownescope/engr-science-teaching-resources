"use client";
import { useState, useEffect } from "react";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { FormattedData } from "@/utils/formatting";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { redirect } from "next/navigation";
import { LinkUpload } from "../../_components/LinkUpload";

const UploadLink = () => {
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    redirect("/unauthorized");
  }

  const [coursesOptionsData, setCoursesOptionsData] =
    useState<FormattedData[]>();
  useEffect(() => {
    const fetchAllCourses = async () => {
      const coursesOptionsData = await fetchCourses();
      console.log(coursesOptionsData.success);
      if (coursesOptionsData.success) {
        setCoursesOptionsData(coursesOptionsData.success);
      }
    };

    fetchAllCourses();
  }, []);

  return (
    <div>
      <LinkUpload coursesOptionsData={coursesOptionsData} />
    </div>
  );
};

export default UploadLink;
