import NavButton from "@/components/layout/nav-button";
import { BookText, Box, LayoutDashboard, LucideIcon, UserRound } from "lucide-react";

export default function MobileNavItems() {
  const mobileNavItems: { icon: LucideIcon; label: string; href: string }[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Box, label: "Courses", href: "/dashboard/courses" },
    { icon: BookText, label: "Classroom", href: "/dashboard/classroom" },
    { icon: UserRound, label: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <div
      className="
        fixed bottom-2 left-1/2 -translate-x-1/2 w-[95%]
        flex items-center justify-around py-2.5
        bg-[#001b12]/90 backdrop-blur-xl
        border-t border-emerald-700/30 rounded-full"
    >
      {mobileNavItems.map((item) => (
        <NavButton key={item.label} {...item} />
      ))}
    </div>
  );
}
