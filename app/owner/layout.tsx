import SideNav from "@/components/(owner hf)/header/side-nav";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | Owner Dashboard - Sheryians',
    default: 'Owner Dashboard - Sheryians Coding School',
  },
  description: 'Manage courses, instructors, and students on Sheryians Coding School platform',
  robots: {
    index: false, // Owner dashboard shouldn't be indexed
    follow: false,
  },
};


export default function OwnerLayout({
  children,
  profile
}: Readonly<{
  children: React.ReactNode;
  profile: React.ReactNode;
}>) {
  return (
    <div className="w-full max-h-screen h-full flex bg-linear-to-tr from-black to-[#0a372a] text-white">
      {/* <aside aria-label="Owner Navigation" className="max-w-20 w-full"> */}
        <SideNav />
      {/* </aside> */}
      ¸
      <main 
        className="relative z-1 w-full h-full"
        role="main"
        id="main-content"
      >
        {children}
        {profile}
      </main>
    </div>
  );
}
