import React from 'react'

function Badge({children}: {children: React.ReactNode}) {
  return (
    <div className="w-fit h-fit text-zinc-300 text-sm font-[Helvetica] px-3 py-1 bg-zinc-200/5 backdrop-blur-sm border border-white/10 rounded-full">
      {children}
    </div>
  )
}

export default Badge
