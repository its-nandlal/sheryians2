import { Chapter } from "@prisma/client";
import { useForm } from "react-hook-form";
import { createChaptersInput, createChaptersSchema } from "../schemas";
import { Form } from "@/components/ui/form";
import { TextField } from "@/module/course/( course )/components/form/text-field";
import ButtonPrimary from "@/components/ui/button-primary";
import FileUpload2 from "@/components/layout/file-upload2";
import { useCreateChapters, useUpdateChapters } from "../hooks/useChapters";
import { useCoursesStore } from "@/module/course/( course )/store/courses-store";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

interface ChapterActionFormProps {
    moduleId: string;
    defaulrData?: Chapter;
    formType: "create" | "edit";
    setOpen: (value: boolean) => void;
}

export default function ChapterActionForm({moduleId, defaulrData, formType, setOpen}: ChapterActionFormProps) {
  
  const form = useForm<createChaptersInput>({
    resolver: zodResolver(createChaptersSchema),
    defaultValues: {
      title:  "",
      description: "",
      moduleId: moduleId
    }
  })

  const createChapterMutate = useCreateChapters()
  const updateChapterMutate = useUpdateChapters(defaulrData?.id || "")

  const selectedFile = useCoursesStore((stat) => stat.selectedFiles)
  const reset = useCoursesStore((stat) => stat.reset)
  const [previewVideo, setPreviewVideo] = useState<string>("")
  
    useEffect(() => {
    if(formType === "edit" && defaulrData){
      form.reset({
        title: defaulrData.title,
        description: defaulrData.description || "",
        moduleId: defaulrData.moduleId
      })
      setPreviewVideo(defaulrData.videoUrl || "")
      reset()
    }

    if(formType === "create"){      
      form.reset({
        title: "",
        description: "",
        moduleId: moduleId
      })
      setPreviewVideo("")
      reset()
    }

  }, [formType, defaulrData, moduleId, reset, form])

  const onSubmit = (data: createChaptersInput) => {
    try {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if(value === undefined || value === null || value === "") return
        formData.append(key, value)
      })

      Object.values(selectedFile).forEach(({name, file}) => {
        console.log("Appending file:", name, file);
        formData.append(name, file as File)
      })

      if(formType === "create") createChapterMutate.mutate(formData)

      if(formType === "edit") updateChapterMutate.mutate(formData)
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while submitting the form.")
    } finally {
      setOpen(false)
      form.reset()
      reset()
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 font-[Helvetica] tracking-wide">

        <div>
          <FileUpload2 name="video" label="Chapter Video" preview={previewVideo} />
        </div>

        <TextField
        form={form}
        name="title"
        label="Title"
        required
        placeholder="Enter chapter title"
        />

        <TextField
        form={form}
        name="description"
        label="Description"
        placeholder="Enter chapter description"
        textarea
        />

        <TextField
        form={form}
        name="moduleId"
        label="Module ID"
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
            {formType === "create" && "Create Module"}
            {formType === "edit" && "Update Module"}
          </ButtonPrimary>
        </div>


      </form>
    </Form>
  )
}
