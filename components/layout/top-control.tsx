import { PackagePlus, Plus, ScanEye } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";

interface TopControlProps {
  createRoute: string;
  createText: string;
  secoundCreateRoute: string;
  secoundCreateText: string;
  viewRoute: string;
  viewText: string;
  setSearch: (search: string) => void;
}

export default function TopControl({ createRoute, createText, secoundCreateRoute, secoundCreateText, viewRoute, viewText, setSearch }: TopControlProps) {
  return (
    <>
      <div className="w-full h-full p-2 grid grid-cols-6 gap-2 bg-linear-to-tr from-[#001b12e1] to-[#004934d7] backdrop-blur-md border border-[#000000] shadow-inner shadow-[#00835e]/50 rounded-4xl">
        {/* Search Section */}
        <div className="w-full h-full p-4 col-span-3 bg-linear-to-tr from-[#001b12e1] to-[#00493483] backdrop-blur-md border border-[#505050] shadow-inner shadow-[#00835e]/50 rounded-xl">
          <div className="space-y-2">
            <h3 className="font-[NeueMachina] text-lg">Search</h3>
            <Input
              type="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by ( Id / Name / Slug )"
              className="bg-[#001b12]/40 backdrop-blur-sm border-[#00835e]/30 focus:border-[#00835e] transition-colors"
            />
          </div>
        </div>

        {/* Instructor Actions */}
        <div className="w-full h-full grid grid-rows-2 gap-2 bg-linear-to-tr from-[#001b1272] to-[#00493495] backdrop-blur-md border border-[#505050] shadow-inner shadow-[#00835e]/50 rounded-xl overflow-hidden">
        </div>

        <div className="w-full h-full grid grid-rows-2 gap-2 bg-linear-to-tr from-[#001b1272] to-[#00493495] backdrop-blur-md border border-[#505050] shadow-inner shadow-[#00835e]/50 rounded-xl overflow-hidden">
          <Link
            href={viewRoute}
            className="w-full h-full flex items-center justify-center gap-2 font-[Helvetica] text-base border border-zinc-500/40 hover:bg-[#00835e]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#00835e]/30"
          >
            <ScanEye className="w-4.5 h-4.5" />
            <span>{viewText}</span>
          </Link>

          <Link
            href={secoundCreateRoute}
            className="w-full h-full flex items-center justify-center gap-2 font-[Helvetica] text-base border border-zinc-500/40 hover:bg-[#00835e]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#00835e]/30"
          >
            <PackagePlus className="w-4.5 h-4.5" />
            <span>{secoundCreateText}</span>
          </Link>
        </div>

        {/* Create Course Button */}
        <div className="w-full h-full bg-linear-to-tr from-[#001b1288] to-[#004934d7] backdrop-blur-md border border-[#505050] shadow-inner shadow-[#00835e]/50 rounded-xl hover:shadow-inner hover:shadow-[#00835e]/40 transition-all duration-200">
          <Link
            href={createRoute}
            className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-[#00835e]/10 transition-colors rounded-xl"
          >
            <Plus className="w-8 h-8" />
            <p className="font-[NeueMachina] text-xl">{createText}</p>
          </Link>
        </div>
      </div>
    </>
  );
}
