"use client"
import { useState, useEffect} from 'react'
import { FileUpload } from '../../_components/FileUpload'
import { fetchCourses } from '@/actions/fetching/fetchCourses';
import { FormattedData } from '@/utils/formatting';
import { useCurrentRole } from '@/hooks/useCurrentRole';
import { redirect } from "next/navigation";

const UploadFile = () => {
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    redirect("/unauthorized");
  }

  const [coursesOptionsData, setCoursesOptionsData] = useState<FormattedData[]>();
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
    <div><FileUpload coursesOptionsData={coursesOptionsData} /></div>
  )
}

export default UploadFile;