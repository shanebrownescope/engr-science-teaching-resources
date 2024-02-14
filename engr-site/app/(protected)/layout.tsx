import { HeaderMegaMenu } from "@/components/mantine";
import { MantineProvider } from "@mantine/core";
type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <MantineProvider> 
        <HeaderMegaMenu />
        {children}
      </MantineProvider>
    </div>
  );
};

export default ProtectedLayout;
