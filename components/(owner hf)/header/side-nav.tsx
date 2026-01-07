"use client"

import logo from '@/assets/logo.webp'
import { Box, ChartColumn, LayoutDashboard, LucideIcon, Settings, SquarePercent, UserRound, UsersRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import ToolTip from '@/components/ui/tooltip'

const mainNavItems: {icon: LucideIcon; label: string; href: string}[] = [
  {icon: LayoutDashboard, label: 'Dashboard', href: '/owner/dashboard'},
  {icon: Box, label: 'Courses', href: '/owner/courses'},
  {icon: UsersRound, label: 'Students', href: '/owner/students'},
  {icon: ChartColumn, label: 'Leaderboard', href: '/owner/leaderboard'},
  {icon: SquarePercent, label: 'Coupons', href: '/owner/coupons'}
]

const bottomNavItems: {icon: LucideIcon; label: string; href: string}[] = [
  { icon: UserRound, label: 'Profile', href: '/owner/profile' },
  { icon: Settings, label: 'Settings', href: '/owner/settings' },
]

export default function SideNav() {
  return (
    <nav className='max-w-20 z-50 w-full h-screen flex flex-col items-center justify-between py-5
     bg-[#0a372a]/50 backdrop-blur-md rounded-r-4xl
     border-r border-zinc-400/20 inset-shadow-sm inset-shadow-[#003d2b]'>
      
      <div>
        <Image src={logo} alt="Logo" width={35} height={35}/>
      </div>

      {/* bg-[#00ffb710] backdrop-blur-md  */}
      <div className='w-full flex flex-col items-center gap-8 py-8
      bg-linear-to-tr from-[#001b12e1] to-[#004934d7] backdrop-blur-md
       rounded-4xl border-2 border-[#002519]/20 shadow-inner shadow-[#002519]/50'>
        {mainNavItems.map(({icon, label, href}) => (
          <NavButton key={label} icon={icon} label={label} href={href} />
        ))}
      </div>

      <div className='w-full flex flex-col items-center gap-8 py-5
       bg-linear-to-tr from-[#001b12e1] to-[#004934d7] backdrop-blur-md
       rounded-4xl border-2 border-[#002519]/20 shadow-inner shadow-[#002519]/50'>
        {bottomNavItems.map(({icon, label, href}) => (
          <NavButton key={label} icon={icon} label={label} href={href} />
        ))}
      </div>
    </nav>
  )
}

function NavButton({icon: Icon, label, href}: {icon: LucideIcon; label: string; href: string}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

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
