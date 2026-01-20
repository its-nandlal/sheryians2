import { CreateModuleInput } from "@/module/course/( course )/schema"
import { Module } from "@prisma/client"
import { FieldValues } from "react-hook-form"
import { create } from "zustand"




//============== Store Props ==================

interface DialogActionProps {
  open: boolean
  setOpen: (open: boolean) => void
}

interface IdStoreProps {
  id: string
  setId: (id: string) => void
  clearId: () => void
}

interface FormTypeProps {
  type: "create" | "edit" // ✅ Fixed typo
  setType: (type: "create" | "edit") => void
  toggleType: () => void
}







//============== Store Actions ==================

export const useDialogActionStore = create<DialogActionProps>((set) => ({
  open: true,
  setOpen: (open) => set({ open })
}))

export const useIdStore = create<IdStoreProps>((set) => ({
  id: "",
  setId: (id) => set({ id }),
  clearId: () => set({ id: "" })
}))

export const use2IdStore = create<IdStoreProps>((set) => ({
  id: "",
  setId: (id) => set({ id }),
  clearId: () => set({ id: "" })
}))

export const useFormTypeStore = create<FormTypeProps>((set) => ({
  type: "create",
  setType: (type) => set({ type }), // ✅ Direct set
  toggleType: () => set((state) => ({
    type: state.type === "create" ? "edit" : "create"
  }))
}))

interface FormDataSetProps<T = any> {
  data: T | null
  setData: (data: T | null) => void
}

export const useFormDataStore = create<FormDataSetProps>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))

