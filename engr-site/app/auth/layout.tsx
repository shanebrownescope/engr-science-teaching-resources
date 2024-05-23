import styles from "@/styles/testAuth.module.css";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.layout}>{children}</div>;
};

export default AuthLayout;
