import { NavbarNested } from "@/components/mantine";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex">
      <NavbarNested />
      {children}
    </div>
  );
};

export default ProtectedLayout;
