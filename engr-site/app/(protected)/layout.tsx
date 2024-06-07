import Footer from "@/components/custom/footer/Footer";
import { HeaderMegaMenu } from "@/components/mantine";
type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <HeaderMegaMenu />
      <div className="h-min-100">{children}</div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
