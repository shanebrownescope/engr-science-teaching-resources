"use client"
import Link from "next/link";
import styles from './navbar.module.css'
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { formattedData } from "@/utils/formatting";
import { fetchCourses } from "@/actions/fetching/fetchCourses";

export const Navbar = () => {
  const pathname = usePathname()
    const [courseList, setCourseList] = useState<any>()

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

    const fetchCoursesList = async() => {
      await fetchCourses() 
        .then((data) => {
          if (data?.failure) {
            console.log("failure in fetchCourses")
          } else {
            setCourseList(data?.success)
          }
        });
    }
  
    fetchCoursesList();
  }, [])

  console.log("navbar course list: ", courseList)
  

  return (
    <nav className={styles.navContainer}> 

      <div> 
        <Link 
            href="/home"
            className={ ` ${styles.logo} `}
          >
            Engineering Teaching Resources
        </Link>
      </div>


      <div className={styles.list}>

        <div> 
          <Link href="/home" className={ ` ${styles.button} ${pathname === "/home" && styles.selected} ` }> 
            Home 
          </Link>
        </div>


        <div> 
          <Link href='/courses ' className={ ` ${styles.button} ${pathname === "/courses" && styles.selected} ` }> 
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
            {courseList?.map((item: formattedData) => (
              <Link 
                key={item.formatted}
                href={`/courses/${item.formatted}`}
              > 
                {item.original} 
              </Link>
            ))}
          </div>

        </div>




        <div> 
          <Link href='/profile' className={ ` ${styles.button} ${pathname === "/profile" && styles.selected} ` }>
            Profile
          </Link>
        </div>
      
      </div>
    </nav>
  );
};


