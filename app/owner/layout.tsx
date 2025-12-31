import SideNav from "@/components/(owner hf)/header/side-nav";



export default function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-h-screen h-full flex bg-linear-to-tr from-black to-[#0a372a] text-white">
      <SideNav />
      {children}
    </div>
  );
}
