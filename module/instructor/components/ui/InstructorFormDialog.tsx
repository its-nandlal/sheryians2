"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ButtonPrimary from "@/components/ui/button-primary"

import { CreateInstructorInput, createInstructorSchema } from "@/module/instructor/types/instructor"
import { useCreateInstructor, useUpdatingInstructor } from "@/module/instructor/hooks/useInstructors"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { ImageUp } from "lucide-react"
import { Instructor } from "@prisma/client"
import { useRouter } from "next/navigation"

interface InstructorFormDialogProps {
  triggerButton?: React.ReactNode
  defaultValues?: Instructor
  mode?: "create" | "edit"
  children: React.ReactNode
  openDefault?: boolean
  rediracting?: boolean
}

export default function InstructorFormDialog({
  triggerButton,
  defaultValues,
  mode = "create",
  children,
  openDefault,
  rediracting
}: InstructorFormDialogProps) {
  const [open, setOpen] = useState(openDefault || false)
  const [preview, setPreview] = useState<string | null>(defaultValues?.avatarUrl || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpdating = useUpdatingInstructor(defaultValues?.id || "")
  const handleCreate  = useCreateInstructor()

  const router = useRouter()

  const { mutate: instructorAction, isPending } = mode === "create" ? handleCreate : handleUpdating

  const form = useForm<CreateInstructorInput>({
    resolver: zodResolver(createInstructorSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      bio: "",
      expertise: [],
    },
  })

  /* ================= File Upload ================= */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  /* ================= Submit ================= */
  const onSubmit = (data: CreateInstructorInput) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("bio", data.bio || "")
    formData.append("expertise", JSON.stringify(data.expertise))

    if (selectedFile) {
      formData.append("avatar", selectedFile)
    }

    if(mode === "create") {
        instructorAction(formData, {
          onSuccess: () => {
            form.reset()
            setPreview(null)
            setSelectedFile(null)
            setOpen(false)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Something went wrong"
            )
          },
        })
    }

    if(mode === "edit") {
        instructorAction(formData, {
            onSuccess: () => {
              form.reset()
              setPreview(null)
              setSelectedFile(null)
              setOpen(false)
            }
        })
    }

  }

  useEffect(()=>{

    if(rediracting && !open){
      router.push("/owner/courses/instructors")
    }


  }, [rediracting, setOpen, open, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || children}
      </DialogTrigger>

      <DialogContent
        className="
          max-w-2xl max-h-[90vh] overflow-y-auto
          rounded-2xl
          bg-linear-to-br from-[#001b12] via-[#002f22] to-[#004934]
          border border-[#00835e]/30
          shadow-2xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-[NeueMachina] text-emerald-50">
            {mode === "create" ? "Create Instructor" : "Edit Instructor"}
          </DialogTitle>
          <DialogDescription className="text-emerald-200/70">
            Manage instructor profile information
          </DialogDescription>
        </DialogHeader>

        {/* ================= Avatar Card ================= */}
        <div className="mt-4 flex items-center gap-6 p-4 rounded-xl border border-[#00835e]/20 bg-[#001b12]/40">
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#00835e]/40 bg-[#001b12]">
              {preview ? (
                <Image
                  src={preview}
                  alt="Avatar preview"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageUp className="w-10 h-10 text-[#00835e]/40" />
                </div>
              )}
            </div>

            <label className="absolute bottom-1 right-1 cursor-pointer">
              <div className="p-2 rounded-full bg-[#00835e] hover:bg-[#00a174] transition">
                <ImageUp className="w-4 h-4 text-black" />
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h3 className="text-lg font-medium text-emerald-50">
              Profile Image
            </h3>
            <p className="text-sm text-emerald-200/60">
              Upload instructor avatar
            </p>
          </div>
        </div>

        {/* ================= Form ================= */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-100">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Instructor name"
                      className="bg-[#001b12]/40 border-[#00835e]/30 text-white focus:border-[#00a174]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-100">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@mail.com"
                      className="bg-[#001b12]/40 border-[#00835e]/30 text-white focus:border-[#00a174]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-emerald-100">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Professional background and experience"
                      className="min-h-32 bg-[#001b12]/40 border-[#00835e]/30 text-zinc-100 focus:border-[#00a174] resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />


            {/* Expertise */}
            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="flex justify-between text-emerald-100">
                    Expertise
                    <span className="text-xs text-emerald-300/60">
                      comma separated
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, Next.js, TypeScript"
                      value={field.value?.join(", ") ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean)
                        )
                      }
                      className="bg-[#001b12]/40 border-[#00835e]/30 text-white focus:border-[#00a174]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-[#00835e]/20">
              <ButtonPrimary
                type="button"
                variant={"destructive"}
                size={"sm"}
                onClick={() => setOpen(false)}
              >
                Cancel
              </ButtonPrimary>

              <ButtonPrimary
                disabled={isPending}
                type="submit"
                size={"sm"} 
                variant={"secondary"}
                className=""
              >
                {isPending
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Instructor"
                  : "Update Instructor"}
              </ButtonPrimary>
            </div>
          </form>
        </Form> 
      </DialogContent>
    </Dialog>
  )
}
