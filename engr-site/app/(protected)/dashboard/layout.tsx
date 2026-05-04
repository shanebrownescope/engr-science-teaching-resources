import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { NavbarNested } from "@/components/mantine";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex">
      <NavbarNested />
      <div style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        <ContainerLayout paddingTop="md">{children}</ContainerLayout>
      </div>
    </div>
  );
};

export default ProtectedLayout;
