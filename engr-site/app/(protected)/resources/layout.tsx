export default async function ResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="md-container"> {children} </div>;
}
