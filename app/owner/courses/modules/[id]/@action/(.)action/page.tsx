"use client"

import DialogAction from "@/components/ui/dialog-action"
import CreateModuleForm from "@/module/course/module/components/( action page )/create-module-form"
import { useDialogActionStore, useFormTypeStore, useIdStore } from "@/store"
import { useEffect } from "react"


export default function ModuleAction() {

  const { type } = useFormTypeStore()
  const { setOpen } = useDialogActionStore()
  const courseId = useIdStore((state) => state.id)


  useEffect(()=>{
    setOpen(true)
  }, [setOpen])

  return (
    <div className='shadow-inner shadow-emerald-700/50 '>

      <DialogAction
       redirecting={true} 
       title={type === "create" && "Create Module" || type === "edit" && "Update Module" || ""}
       description={type === "create" && "Manage module information." || type === "edit" && "Update module information." || ""}
       redirectingPath={`/owner/courses/modules/${courseId}`}>
      <CreateModuleForm />
      </DialogAction>

    </div>
  )
}
