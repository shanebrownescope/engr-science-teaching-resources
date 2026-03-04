"use client";
import { useEffect } from "react";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { status } = useSession();
  const role = useCurrentRole();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && role !== "admin" && role !== "instructor") {
      console.log("-- not admin or instructor, redirecting");
      router.push("/unauthorized");
    }
  }, [status, role, router]);

  if (status === "loading" || (status === "authenticated" && role !== "admin" && role !== "instructor")) {
    return <div>Loading...</div>;
  }

  return (
    <ContainerLayout>
      <div className={styles.container}>
        <h4 className="text-center">
          {role === "admin" ? "Welcome Admin!" : "Welcome Instructor!"}
        </h4>
        <div>
          <p className="heading-6 bold"> Want to upload a new resource?</p>
          <p> Click on the links below Upload resource </p>
        </div>
        {role === "admin" && (
          <>
            <div>
              <p className="heading-6 bold"> Want to add content to the site?</p>
              <p> Click on the links below Add content </p>
            </div>
            <div>
              <p className="heading-6 bold"> Want to manage existing courses?</p>
              <p>
                <button
                  onClick={() => router.push('/courses/manage')}
                  style={{
                    background: 'black',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Manage Courses
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </ContainerLayout>
  );
};

export default DashboardPage;
