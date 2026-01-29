import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AlertMessage from "./alert-dialog"

interface DropdownMenuActionProps {
  children: React.ReactNode,
  viewText?: string
  actionText: string,
  title:string,
  viewAction?: () => void,
  copyIdAction?: () => void,
  editAction?: () => void,
  deleteAction?: () => void,
}

export default function DropdownMenuAction({ children, viewText, actionText, title, viewAction, copyIdAction, editAction, deleteAction}: DropdownMenuActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="
          w-56
          p-2
          bg-emerald-950/95
          backdrop-blur-xl
          border border-emerald-800/40
          rounded-xl
          shadow-xl shadow-black/40
          space-y-1
        "
      >
        {/* View ID */}
        {viewText && viewAction && (
        <Button
          type="button"
          onClick={viewAction}
          className="w-full justify-between bg-transparent text-emerald-100 hover:bg-emerald-900/60 active:bg-emerald-900/80 rounded-md px-3 py-2 h-auto">
          {viewText}
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </Button>
        )}


        {/* Copy ID */}
        <Button
          type="button"
          onClick={copyIdAction}
          className="
            w-full justify-between
            bg-transparent
            text-emerald-100
            hover:bg-emerald-900/60
            active:bg-emerald-900/80
            rounded-md
            px-3 py-2
            h-auto
          "
        >
          Copy ID
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </Button>

        {/* Edit */}
        <Button
          type="button"
          onClick={editAction}
          className="
            w-full justify-between
            bg-transparent
            text-emerald-100
            hover:bg-emerald-900/60
            active:bg-emerald-900/80
            rounded-md
            px-3 py-2
            h-auto
          "
        >
          Edit {actionText}
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </Button>

        {/* Delete */}
        <AlertMessage
        onConfirm={deleteAction}
        description={`This action cannot be undone. This will "${title}" permanently delete your data.`}
        onConfirmText="Delete Module"
        >
        <Button
          type="button"
          className="
            w-full justify-between
            text-red-400
            bg-red-800/50
            hover:bg-red-950/60
            active:bg-red-950/80
            rounded-md
            px-3 py-2
            h-auto
          "
        >
          Delete {actionText}
          <DropdownMenuShortcut className="text-red-400">
            ⌘⌫
          </DropdownMenuShortcut>
        </Button>
        </AlertMessage>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
