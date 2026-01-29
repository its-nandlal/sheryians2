import SearchInput from "@/components/ui/searchInput";
import { StudentRegistrationChart } from "./student-regitration-chart";

export default function TopControler() {
  return (
    <div
      className="w-full h-32
    flex gap-4
    bg-emerald-500/20 bg-linear-to-tr from-[#004934d7] to-[#001b12e1] 
    backdrop-blur-md border border-[#000000] 
    shadow-inner shadow-[#00835e]/50 rounded-4xl overflow-hidden">

      <div className="w-1/3 h-full flex flex-col justify-center p-4 gap-2 ">
        <h3 className="text-xl text-emerald-50">Search</h3>
        <SearchInput placeholderText='Search filter by ( id, name, email etc...)'/>
      </div>

      <div className="w-2/3 h-full flex items-center justify-end py-12">
        <StudentRegistrationChart />
      </div>

    </div>
  );
}
