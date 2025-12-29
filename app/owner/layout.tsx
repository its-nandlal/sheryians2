


export default function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-h-screen h-full">
      {children}
    </div>
  );
}
