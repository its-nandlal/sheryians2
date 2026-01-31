"use client"

import logo from '@/assets/logo.webp'
import NavButton from '@/components/layout/nav-button'
import { Box, ChartColumn, LayoutDashboard, LucideIcon, Settings, SquarePercent, UserRound, UsersRound } from 'lucide-react'
import Image from 'next/image'

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

