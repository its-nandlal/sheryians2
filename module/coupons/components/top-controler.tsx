"use client"
import ButtonPrimary from "@/components/ui/button-primary";
import SearchInput from "@/components/ui/searchInput";
import { useFormTypeStore } from "@/store";
import Link from "next/link";

export default function TopControler() {

    const {setType} = useFormTypeStore()
  
    const handleCreate = () => setType("create")

  return (
    <div className="w-full h-24 px-3 py-1
    flex items-center justify-between
    bg-linear-to-tr from-[#004934d7] to-[#001b12e1] 
    backdrop-blur-md border border-[#000000] 
    shadow-inner shadow-[#00835e]/50 
    rounded-4xl">

      <div className="w-1/3 flex flex-col justify-center p-4 gap-2 ">
        <h3 className="text-xl text-emerald-50">Search</h3>
        <SearchInput placeholderText='Search filter by ( code, discount etc... )'/>
      </div>

      <Link href="/owner/coupons/action">
        <ButtonPrimary
        onClick={handleCreate}
        variant={"secondary"}
        size={"sm"}>
          Create Coupon
        </ButtonPrimary>
      </Link>


    </div>
  )
}
