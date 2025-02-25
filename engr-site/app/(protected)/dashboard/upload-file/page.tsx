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

  const [coursesOptionsData, setCoursesOptionsData] = useState<any[]>();
  useEffect(() => {
    const fetchAllCourses = async () => {
      const coursesOptionsData = await fetchCourses();
      console.log(coursesOptionsData.success);
      if (coursesOptionsData.success) {
        console.log("success: ", coursesOptionsData.success);
        // const formattedData = coursesOptionsData?.success?.map((course: FormattedData) => ({
        //   value: course.id.toString(),
        //   url: course.url,
        //   label: course.name,
        // }));
        // setCoursesOptionsData(formattedData);
        setCoursesOptionsData(coursesOptionsData.success);
      }
    };

    fetchAllCourses();
  }, []);

  console.log("coursesOptionsData: ", coursesOptionsData);
  return (
    <div>
      <FileUpload coursesOptionsData={coursesOptionsData} />
    </div>
  );
};

export default UploadFile;
