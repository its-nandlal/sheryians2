import Link from "next/link";
import ToolTip from "../ui/tooltip";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

export default function NavButton({icon: Icon, label, href}: {icon: LucideIcon; label: string; href: string}) {
  const pathname = usePathname();
  const strictParents = ["/dashboard", "/owner"];

  const isActive = strictParents.includes(href)
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href}>
      <ToolTip label={label}>
        <motion.div
        className={`w-fit h-fit bg-[#005b41fe]/70 backdrop-blur-xs border border-[#00ffb710] shadow-inner p-4 rounded-full origin-center group
          ${isActive ? 'shadow-[#00ffb710]/70 scale-[1] opacity-95' : 'shadow-[#002e21]/50 opacity-45 scale-[.8]'}`}

          initial={{
            opacity: 0.5,
            scale: 0.8
          }}

          animate={{
            opacity: 0.95,
            scale: 1
          }}
        whileHover={{
          scale: 1,
          opacity: 0.95,
        }}
        whileTap={{
          scale: 1.1,
          opacity: 0.95,
        }}
        transition={{ duration: 0.5, ease: "backInOut" }}
      >
        <Icon className={`w-5 h-5 ease-in-out duration-300 ${isActive ? 'opacity-95' : 'opacity-65 group-hover:opacity-95'}`} />
        </motion.div>
      </ToolTip>
    </Link>
  )
}