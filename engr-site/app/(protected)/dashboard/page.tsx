"use client";
import { notFound, redirect } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import styles from "./page.module.css";

const DashboardPage = () => {
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    redirect("/unauthorized");
    // redirect("/unauthorized");
  }

  return (
    <ContainerLayout>
      <div className={styles.container}>
        <h4 className="text-center"> Welcome Admin! </h4>
        <div>
          <p className="heading-6 bold"> Want to upload a new resource?</p>
          <p> Click on the links below Upload resource </p>
        </div>
        <div>
          <p className="heading-6 bold"> Want to add content to the site?</p>
          <p> Click on the links below Add content </p>
        </div>
      </div>
    </ContainerLayout>
  );
};

export default DashboardPage;
