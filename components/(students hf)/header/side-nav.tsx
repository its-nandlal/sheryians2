"use client";

import { useEffect, useState } from "react";
import DesktopNav from "./desktop-nav";
import MobileNavItems from "./mobile-nav";
export default function SideNav() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth > 768);

    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ⛔ hydration mismatch avoid
  if (isDesktop === null) return null;

  return (
    <nav className="relative z-999 w-full max-md:px-4">
      {isDesktop ? <DesktopNav /> : <MobileNavItems />}
    </nav>
  );
}
