import { HeaderMegaMenu } from "@/components/mantine";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <HeaderMegaMenu />
      {children}
    </div>
  );
};

export default ProtectedLayout;
