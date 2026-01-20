"use client"

import ButtonPrimary from '../ui/button-primary'
import { ArrowLeftCircle, PlusCircle } from 'lucide-react'
import Link from 'next/link';
import SearchInput from '../ui/searchInput';
import { useFormTypeStore } from '@/store';


interface TopControlProps {
  backRoute: string;
  backText: string;
  createRoute: string;
  createText: string;
}

export default function TopControl2({backRoute, backText, createRoute, createText}: TopControlProps) {

  const {setType} = useFormTypeStore()

  const handleCreate = () => setType("create")

  return (
      <div className="
      w-full h-20 p-4
      flex items-center justify-between
      bg-emerald-900/70 backdrop-blur-md
      outline outline-emerald-500/30
      border border-emerald-800/40
      shadow-inner shadow-emerald-800/50
      rounded-xl">
        <div className="w-1/3 space-y-1">
          <h6 className="text-sm text-emerald-50">Search</h6>
          <SearchInput placeholderText='Search filter by ( name, date, etc... )'/>
        </div>

        <div className="flex items-center gap-4">
          <Link href={backRoute}>
            <ButtonPrimary
              size="sm"
              variant="secondary"
              className="text-nowrap bg-red-700/50 hover:bg-red-800 flex items-center gap-2">
              <ArrowLeftCircle className="w-4 h-4 bg-red-800 text-emerald-100 rounded-full" />
              {backText}
            </ButtonPrimary>
          </Link>

          <Link href={createRoute}>
            <ButtonPrimary
            onClick={handleCreate}
              size="sm"
              variant="secondary"
              className="text-nowrap bg-emerald-700/50 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              {createText}
            </ButtonPrimary>
          </Link>
        </div>
      </div>
  )
}
