import { Navbar } from "./_components/Navbar";

type ProtectedLayoutProps = {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      {/* <Navbar /> */}
      {children}
    </div>
  )
}

export default ProtectedLayout;