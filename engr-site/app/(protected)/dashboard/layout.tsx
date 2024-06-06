import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { NavbarNested } from "@/components/mantine";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
   
    <div className="flex">
      <NavbarNested />
      <ContainerLayout paddingTop="md">  
      {children}
      </ContainerLayout>
    </div>

  );
};

export default ProtectedLayout;
