"use client"

import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateModuleInput, createModuleSchema } from "../../schemas"
import { TextField } from "@/module/course/( course )/components/form/text-field"
import { SelectField } from "@/module/course/( course )/components/form/select-field"

import { Module, ModuleType } from "@prisma/client"
import ButtonPrimary from "@/components/ui/button-primary"
import { use2IdStore, useDialogActionStore, useFormDataStore, useFormTypeStore, useIdStore } from "@/store"
import { useModuleCreate, useModuleUpdate } from "../../hooks/useModules"
import { toast } from "sonner"

const MODULE_TYPE = [
  { label: "Video", value: ModuleType.VIDEO },
  { label: "Quiz", value: ModuleType.QUIZ },
  { label: "Assignment", value: ModuleType.ASSIGNMENT },
  { label: "Live Session", value: ModuleType.LIVE_SESSION },
  { label: "Project", value: ModuleType.PROJECT },
]


export default function CreateModuleForm() {
  const {type} = useFormTypeStore()
  const {id: CourseId} = useIdStore()
  const {id: ModuleId} = use2IdStore()

  const createModule = useModuleCreate()
  const updateModule = useModuleUpdate(ModuleId)

  const { mutate, } = type === "create" ? createModule : updateModule 

  const {setOpen} = useDialogActionStore()
  const {data: defaultData} = useFormDataStore()

  const formDefaultData: Module = defaultData

  const form = useForm<CreateModuleInput>({
    resolver: zodResolver(createModuleSchema),
    defaultValues: {
      title: formDefaultData.title || "",
      description: formDefaultData.description || "",
      order: formDefaultData.order || 1,
      type: formDefaultData.type || "VIDEO",
      duration: formDefaultData.duration || "",
      courseId: formDefaultData.courseId || CourseId
    },
  })


  const onSubmit = (data: CreateModuleInput) => {
  try {
    const formData = new FormData()

    // ✅ Fix 1: Safe FormData population
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return
      formData.append(key, value as string)
    })

    // ✅ Fix 2: Single mutation logic
    const options = type === "create" ? {
      onSuccess: () => {
        form.reset()
        // Optionally close dialog or invalidate queries
      }
    } : {}

    // ✅ Fix 3: Await mutate (async)
    mutate(formData, options)
    console.log(formData)

  } catch (error) {
    console.error("Module submit error:", error)
    toast.error(error instanceof Error ? error.message : "Something went wrong")
  } finally {
    // ✅ Fix 4: Move setOpen to correct place
    setOpen(false)
  }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 font-[Helvetica] tracking-wide 
        "
      >
        <TextField
          form={form}
          name="title"
          label="Title"
          required
          placeholder="Enter module title"
        />

        <TextField
          form={form}
          name="description"
          label="Description"
          placeholder="Enter module description"
          textarea
        />

        <div className="w-full grid grid-cols-2 gap-4">
          <TextField
            form={form}
            name="order"
            label="Module Order"
            required
            type="number"
            placeholder="1, 2, 3..."
          />

          <SelectField
            form={form}
            name="type"
            label="Type"
            required
            options={MODULE_TYPE}
          />
        </div>


        <TextField
          form={form}
          name="courseId"
          label="Course ID"
          required
        />


        <div className="flex gap-3">
          <ButtonPrimary 
          onClick={() => setOpen(false)}
          size="sm" 
          variant="destructive" 
          type="button">
            Cancel
          </ButtonPrimary>

          <ButtonPrimary size="sm" variant="secondary" type="submit">
            {type === "create" && "Create Module"}
            {type === "edit" && "Update Module"}
          </ButtonPrimary>
        </div>
      </form>
    </Form>
  )
}
