"use client"

import { usePaginationStore } from '@/store/use-pagination-store';
import { Input } from './input';



export default function SearchInput({placeholderText}: {placeholderText: string}) {
  const {setSearch} = usePaginationStore()


  return (
    <div className='w-full'>
      <Input
      onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholderText}
        className="w-full bg-[#001b12]/40 backdrop-blur-sm border-[#00835e]/30 focus:border-[#00835e]"
      />      
    </div>
  )
}
