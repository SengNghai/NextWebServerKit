export default function MLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
       <div>Mobile Layout</div>
       {children}
      </>
    );
  }