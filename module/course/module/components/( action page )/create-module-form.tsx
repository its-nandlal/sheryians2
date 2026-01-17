"use client"

import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateModuleInput, createModuleSchema } from "../../schemas"
import { TextField } from "@/module/course/( course )/components/form/text-field"
import { SelectField } from "@/module/course/( course )/components/form/select-field"

import { ModuleType } from "@prisma/client"
import ButtonPrimary from "@/components/ui/button-primary"

const MODULE_TYPE = [
  { label: "Video", value: ModuleType.VIDEO },
  { label: "Quiz", value: ModuleType.QUIZ },
  { label: "Assignment", value: ModuleType.ASSIGNMENT },
  { label: "Live Session", value: ModuleType.LIVE_SESSION },
  { label: "Project", value: ModuleType.PROJECT },
]

export default function CreateModuleForm() {
  const ModuleFormType = "create"
  const CourseId = "cani12311snIididooojID_JId02ad_Ddd"

  const form = useForm<CreateModuleInput>({
    resolver: zodResolver(createModuleSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 1,
      type: "VIDEO",
      duration: "",
      courseId: CourseId, // ✅ correct
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log("MODULE DATA 👉", data)
        })}
        className="space-y-6 font-[Helvetica] tracking-wide "
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
          value={CourseId}
          required
        />


        <div className="flex gap-3">
          <ButtonPrimary size="sm" variant="destructive" type="button">
            Cancel
          </ButtonPrimary>

          <ButtonPrimary size="sm" variant="secondary" type="submit">
            {ModuleFormType === "create" && "Create Module"}
          </ButtonPrimary>
        </div>
      </form>
    </Form>
  )
}
