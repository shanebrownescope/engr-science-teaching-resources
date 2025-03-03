export default async function ResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="resource-layout">
      {children}
      
      <style jsx>{`
        .resource-layout {
          background-color: #f9f9f9;
          min-height: 100vh;
          padding: 2rem 0;
        }
      `}</style>
    </div>
  );
}