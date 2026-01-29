import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function DropdowMenu2({children}: {children: React.ReactNode}) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
            type="button"
            className="p-1 bg-transparent">
                <EllipsisVertical />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
        className="
          w-56
          p-2
          bg-emerald-750/95
          backdrop-blur-xl
          border border-emerald-500/40
          rounded-xl
          shadow-xl shadow-black/40
          space-y-2">
            {children}
        </DropdownMenuContent>

    </DropdownMenu>
  )
}
