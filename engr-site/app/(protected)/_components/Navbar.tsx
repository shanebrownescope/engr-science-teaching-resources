"use client";
import Link from "next/link";
import styles from "./navbar.module.css";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FormattedData } from "@/utils/formatting";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { useCurrentRole } from "@/hooks/useCurrentRole";

export const Navbar = () => {
  const pathname = usePathname();
  const [courseList, setCourseList] = useState<any>();
  const role = useCurrentRole();

  // const [courseList, setCourseList] = useState<formattedData[] | undefined>()

  useEffect(() => {
    // const fetchCourses = async() => {
    //   await fetchCourseNames("courses/")
    //     .then((data) => {
    //       if (data.failure) {
    //         console.log("failure in fetching course data")
    //       } else {
    //         setCourseList(data?.success?.courseList)
    //       }
    //     });
    // }

    const fetchCoursesList = async () => {
      await fetchCourses().then((data) => {
        if (data?.failure) {
          console.log("failure in fetchCourses");
        } else {
          setCourseList(data?.success);
        }
      });
    };

    fetchCoursesList();
  }, []);

  console.log("navbar course list: ", courseList);

  return (
    <nav className={styles.navContainer}>
      <div>
        <Link href="/home" className={` ${styles.logo} `}>
          Engineering Teaching Resources
        </Link>
      </div>

      <div className={styles.list}>
        <div>
          <Link
            href="/home"
            className={` ${styles.button} ${
              pathname === "/home" && styles.selected
            } `}
          >
            Home
          </Link>
        </div>

        <div>
          <Link
            href="/courses "
            className={` ${styles.button} ${
              pathname === "/courses" && styles.selected
            } `}
          >
            Courses
          </Link>

          {/* <div className={styles.courseList}>
            {courseList?.map(item => (
              <Link 
                key={item.original}
                href={`/courses/${item.original}`}
              > 
                {item.formatted} 
              </Link>
            ))}
          </div> */}

          <div className={styles.courseList}>
            {courseList?.map((item: FormattedData) => (
              <Link key={item.id} href={`/courses/${item.url}`}>
                {item.name}
              </Link>
            ))}
            
            {/* Add Manage Courses link for admins */}
            {role === "admin" && (
              <Link 
                href="/courses/manage"
                className={`${styles.manageCourses} ${
                  pathname === "/courses/manage" && styles.selected
                }`}
              >
                Manage Courses
              </Link>
            )}
          </div>
        </div>

        <div>
          <Link
            href="/profile"
            className={` ${styles.button} ${
              pathname === "/profile" && styles.selected
            } `}
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};