"use client"

import Image from 'next/image'
import logo from '@/assets/logo.webp'
import ButtonPrimary from '../../ui/button-primary'
import { PhoneCall } from 'lucide-react'
import Link from 'next/link'
import AuthButton from './auth-button'
import { useState, useEffect, useRef } from 'react'

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/", label: "Courses" },
  { href: "/", label: "Bootcamps" }
];

export default function Header() {
  const [isAuthActive, setIsAuthActive] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='fixed top-0 left-0 z-2 w-full flex items-center justify-between p-5 backdrop-blur-md rounded-b-3xl'>
      {/* Logo */}
      <div className='flex items-center gap-4'>
        <Image src={logo} alt="Logo" width={40} height={40} />
        <span className='font-[NeueMachina] leading-[1.1]'>
          Sheryians<br />coding school
        </span>
      </div>


      <div className='md:w-1/2 flex items-center justify-between'>
        {/* Navigation */}
        <nav className='font-[NeueMachina] text-sm tracking-wide flex items-center gap-8 max-md:hidden'>
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href} 
              className='hover:text-[#28dcb2e3] ease-in-out duration-200'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-4'>
          <hr className='w-44 border-[#00ffbf]/15 max-md:hidden' />

          <ButtonPrimary size="sm" variant="outline" className='flex items-center gap-2 max-md:hidden'>
            <PhoneCall className='w-5 h-5' /> Callback Request
          </ButtonPrimary>

          <div ref={authRef} className='relative'>
            <ButtonPrimary 
              onClick={() => setIsAuthActive(!isAuthActive)} 
              size="sm" 
              className='font-semibold relative z-2'
            >
              Get Started
            </ButtonPrimary>
            <AuthButton active={isAuthActive} />
          </div>
        </div>
      </div>
    </div>
  )
}
