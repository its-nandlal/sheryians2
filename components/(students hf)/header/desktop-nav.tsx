import Image from "next/image";
import logo from "@/assets/logo.webp";
import {
  BookText,
  Box,
  LayoutDashboard,
  LucideIcon,
  PhoneCall,
  Settings,
  Tent,
  UserRound,
} from "lucide-react";
import NavButton from "@/components/layout/nav-button";


export default function DesktopNav() {
  const mainNavItems: { icon: LucideIcon; label: string; href: string }[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Box, label: "Courses", href: "/dashboard/courses" },
    { icon: Tent, label: "Bootcamp", href: "/dashboard/bootcamp" },
    { icon: BookText, label: "Classroom", href: "/dashboard/classroom" },
    { icon: PhoneCall, label: "Request Callback", href: "/dashboard/requestcallbac" },
  ];

  const bottomNavItems: { icon: LucideIcon; label: string; href: string }[] = [
    { icon: UserRound, label: "Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div
      className="
        max-w-20 h-screen flex flex-col items-center justify-between py-5
        bg-[#0a372a]/50 backdrop-blur-md
        rounded-r-4xl border-r border-zinc-400/20
      "
    >
      <Image src={logo} alt="Logo" width={35} height={35} />

      <div className="w-full flex flex-col items-center gap-8 py-8 bg-emerald-900/10 backdrop-blur-md rounded-2xl">
        {mainNavItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </div>

      <div className="w-full flex flex-col items-center gap-8 py-5 bg-emerald-900/10 backdrop-blur-md rounded-2xl">
        {bottomNavItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
