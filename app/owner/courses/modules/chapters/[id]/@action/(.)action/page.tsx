"use client"

import DialogAction from "@/components/ui/dialog-action";
import ChapterActionForm from "@/module/course/module/chapters/components/chapter-action-form";
import { use2IdStore, useDialogActionStore, useFormDataStore, useFormTypeStore } from "@/store";
import { useEffect } from "react";

export default function ChaptersAction() {

  const type = useFormTypeStore((state) => state.type)
  const setOpen = useDialogActionStore((state) => state.setOpen)
  const moduleId = use2IdStore((state) => state.id)
  const defaultData = useFormDataStore((state) => state.data)

  useEffect(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <div className='shadow-inner shadow-emerald-700/50 '>
      <DialogAction
      redirecting={true}
      title={type === "create" && "Create Chapter" || type === "edit" && "Update Chapter" || ""}
      description={type === "create" && "Manage chapter information." || type === "edit" && "Update chapter information." || ""}
      redirectingPath={`/owner/courses/modules/chapters/${moduleId}`}>
        <ChapterActionForm moduleId={moduleId} formType={type} defaulrData={defaultData} setOpen={setOpen} />
      </DialogAction>
    </div>
  )
}
