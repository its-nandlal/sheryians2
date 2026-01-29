'use client'

import { useId } from 'react'

interface ToolTipProps {
  children: React.ReactNode
  label: string
  position?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
}

export default function ToolTip({ 
  children, 
  label, 
  position = 'right',
  delay = 200 
}: ToolTipProps) {
  const id = useId()
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'top-1/2 left-[calc(70%+12px)] -translate-y-1/2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'top-1/2 right-[calc(70%+12px)] -translate-y-1/2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-[#00ffb3]/20',
    right: 'top-1/2 right-full -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-[#00ffb3]/20',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[#00ffb3]/20',
    left: 'top-1/2 left-full -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-[#00ffb3]/20'
  }

  return (
    <div className='relative group w-fit h-fit'>
      {/* Trigger Element */}
      <div 
        aria-describedby={id}
        className='cursor-pointer'
      >
        {children}
      </div>

      {/* Tooltip */}
      <div
        id={id}
        role="tooltip"
        style={{ transitionDelay: `${delay}ms` }}
        className={`
          absolute z-99 ${positionClasses[position]}
          px-4 py-1.5 rounded-full
          bg-[#007c57]/80 backdrop-blur-md
          border border-[#00ffb3]/5 
          shadow-inner shadow-[#00ffb3]/15
          text-shadow-2xs text-shadow-zinc-900
          font-[NeueMachina]! font-semibold text-sm tracking-wider
          opacity-0 scale-75 pointer-events-none whitespace-nowrap
          group-hover:opacity-100 
          transition-all duration-200 ease-out
        `}
      >
        {label}
        
        {/* Arrow */}
        <div 
          className={`
            absolute w-0 h-0 
            border-[6px] ${arrowClasses[position]}
          `}
        />
      </div>
    </div>
  )
}
