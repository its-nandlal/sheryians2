import SideNav from "@/components/(students hf)/header/side-nav";

export default function DashboardLayout({
  children,
  profile
}: {
  children: React.ReactNode;
  profile: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full bg-linear-to-tr from-black to-[#0a372a] text-white">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        {/* Sidebar */}
        <aside className="w-20 shrink-0">
          <SideNav />
        </aside>

        {/* Main Content */}
        <main
          className="relative z-1 flex-1 overflow-y-auto"
          role="main"
          id="main-content"
        >
          {children}
          {profile}
        </main>
      </div>

      {/* Mobile Layout */}
      <div className=" md:hidden flex flex-col h-full">
        <main
          className="flex-1 overflow-y-auto pb-24 max-md:pb-32"
          role="main"
          id="main-content"
        >
          {children}
          {profile}
        </main>

        {/* Bottom Nav */}
        <SideNav />
      </div>
    </div>
  );
}
