"use client";

import ButtonPrimary from "@/components/ui/button-primary";
import { Form } from "@/components/ui/form";
import { CreateCourseInput, createCourseSchema } from "../schema/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { IndianRupee } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Course,
  CourseDays,
  CourseDuration,
  CourseLevel,
  CourseStatus,
  CourseType,
  Language,
} from "@prisma/client";
import { TextField } from "./form/text-field";
import { SelectField } from "./form/select-field";
import { FileUpload } from "./form/file-upload";
import { SectionHeader } from "./form/section-header";
import { toast } from "sonner";
import { useCreateCourse, useUpdateCourse } from "../hooks/useCourses";
import { useCoursesStore } from "../store/courses-store";
import { useEffect } from "react";


interface CourseFormProps {
  defaultValues?: Course;
  mode?: "create" | "edit"
}


const DURATION_OPTIONS = [
  { label: "1 Month (40-60h)", value: CourseDuration.ONE_MONTH },
  { label: "3 Months (120-180h)", value: CourseDuration.THREE_MONTHS },
  { label: "6 Months (240-360h)", value: CourseDuration.SIX_MONTHS },
  { label: "9 Months (360-540h)", value: CourseDuration.NINE_MONTHS },
  { label: "1 Year (480-720h)", value: CourseDuration.ONE_YEAR },
];

const TYPE_OPTIONS = [
  { label: "Cohort", value: CourseType.COHORT },
  { label: "Bootcamp", value: CourseType.BOOTCAMP },
  { label: "Self Paced", value: CourseType.SELF_PACED },
];

const STATUS_OPTIONS = [
  { label: "Archived", value: CourseStatus.ARCHIVED },
  { label: "Upcoming", value: CourseStatus.UPCOMING },
  { label: "Live", value: CourseStatus.LIVE },
  { label: "Completed", value: CourseStatus.COMPLETED },
];

const LANGUAGE_OPTIONS = [
  { label: "Hinglish", value: Language.HINGLISH },
  { label: "Hindi", value: Language.HINDI },
  { label: "English", value: Language.ENGLISH },
];

const LEVEL_OPTIONS = [
  { label: "Beginner", value: CourseLevel.BEGINNER },
  { label: "Elementary", value: CourseLevel.ELEMENTARY },
  { label: "Intermediate", value: CourseLevel.INTERMEDIATE },
  { label: "Advanced", value: CourseLevel.ADVANCED },
  { label: "Expert", value: CourseLevel.EXPERT },
];

const DAYS_OPTIONS = [
  { label: "MON_FRI", value: CourseDays.MON_FRI },
  { label: "MON_SAT", value: CourseDays.MON_SAT },
  { label: "WEEKENDS", value: CourseDays.WEEKENDS },
];


const convertCourseToFormData = (course: Course): Partial<CreateCourseInput> => {
  return {
    title: course.title,
    subtitle: course.subtitle ?? "",
    description: course.description ?? "",
    slug: course.slug,
    language: course.language,
    type: course.type,
    status: course.status,
    price: course.price,
    discountedPrice: course.discountedPrice ?? 0,
    introVideoUrl: course.introVideoUrl ?? "",
    tags: course.tags as string[],
    days: course.days || "MON_FRI",
    startTime: course.startTime ?? "",
    duration: course.duration,
    level: course.level,
    metaTitle: course.metaTitle ?? "",
    metaDesc: course.metaDesc ?? "",
    metaKeywords: (course.metaKeywords as string[]) ?? [],
  };
};


export default function CourseForm({defaultValues, mode = "create"}: CourseFormProps) {
const form = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: defaultValues ? convertCourseToFormData(defaultValues) : {
      title: "",
      subtitle: "",
      description: "",
      slug: "",
      language: "HINGLISH",
      type: "COHORT",
      status: "UPCOMING",
      price: 0,
      discountedPrice: 0,
      introVideoUrl: "",
      tags: [],
      days: "MON_SAT",
      startTime: "",
      duration: "THREE_MONTHS",
      level: "ADVANCED",
      metaTitle: "",
      metaDesc: "",
      metaKeywords: [],
    },
});

const courseId = defaultValues?.id || ""

const createCourse = useCreateCourse()
const updateCourse = useUpdateCourse(courseId)

const { mutate, isPending } = mode === "create" ? createCourse : updateCourse

const { selectedFiles, initializeFromDefaults, reset} = useCoursesStore()

useEffect(()=>{

  if(mode === "edit"){
    const existingFileUrls: Record<string, string> = {}

    if(defaultValues?.bannerUrl) existingFileUrls.banner = defaultValues.bannerUrl
    if(defaultValues?.thumbnailUrl) existingFileUrls.thumbnail = defaultValues.thumbnailUrl

    initializeFromDefaults(existingFileUrls)
  }
  reset()

}, [defaultValues, mode, initializeFromDefaults, reset])

const submit = (data: CreateCourseInput) => {
  try {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(`${key}[]`, String(item))
        })
        return
      }

      if (typeof value === "number") {
        formData.append(key, value.toString())
        return
      }

      formData.append(key, value as string)
    })

    // 👇 Object.values से files extract करें
    Object.values(selectedFiles).forEach(({ name, file }) => {
      formData.append(name, file as File)
      console.log(`Uploading ${name}:`, file?.name)
    })

    if(mode === "create") {
      mutate(formData,{
        onSuccess: ()=>{
          form.reset()
          reset()
        }
      })
    }

    if(mode === "edit") {
      mutate(formData)
    }

  } catch (error) {
    console.error(error)
    toast.error("Something went wrong on submit")
  } finally {

  }
}

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="w-full h-full flex flex-col">
          {/* Main Content */}
          <div className="flex-1 grid grid-cols-2 gap-6 p-8 overflow-hidden">
            {/* LEFT - Media & SEO */}
            <div className="h-full overflow-y-scroll pr-4 space-y-6 scrollbar-thin scrollbar-thumb-emerald-600/40">
              {/* Header */}
              <div className="pb-5">
                <h1 className="text-4xl font-[NeueMachina] font-bold text-emerald-50">
                  Create New Course
                </h1>
                <p className="text-sm text-emerald-200/60 mt-1">
                  Fill in the details to create a new course
                </p>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <SectionHeader title="Media Assets" />
                <div className="grid grid-cols-2 gap-4">
                  <FileUpload
                    name="thumbnail"
                    label="Thumbnail"
                    preview={defaultValues && defaultValues.thumbnailUrl || ""}
                  />
                  <FileUpload name="banner" label="Banner" />
                </div>
                <TextField
                  form={form}
                  name="introVideoUrl"
                  type="url"
                  label="Intro Video URL"
                  placeholder="https://youtube.com/watch?v=..."
                  descriptionText="Optional promo video"
                />
              </div>

              {/* SEO Section */}
              <div className="space-y-4 pt-6 border-t border-emerald-500/20">
                <SectionHeader title="SEO Optimization" />
                <TextField
                  form={form}
                  name="metaTitle"
                  label="Meta Title"
                  placeholder="SEO title (50-60 chars)"
                  maxLength={60}
                />
                <TextField
                  form={form}
                  name="metaDesc"
                  label="Meta Description"
                  placeholder="SEO description (150-160 chars)"
                  maxLength={160}
                  textarea
                />
                <TextField
                  form={form}
                  name="metaKeywords"
                  label="Meta Keywords"
                  required
                  placeholder="react, nextjs (comma separated)"
                  keywordsHandler={true}
                />
              </div>
            </div>

            {/* RIGHT - Course Details */}
            <div className="h-full overflow-y-scroll pr-4 space-y-6 scrollbar-thin scrollbar-thumb-emerald-600/40">
              {/* Basic Info */}
              <div className="space-y-4">
                <SectionHeader title="Course Information" />
                <TextField
                  form={form}
                  name="title"
                  label="Course Title"
                  placeholder="Full Stack Web Development"
                  required
                />
                <TextField
                  form={form}
                  name="slug"
                  label="Slug"
                  placeholder="full-stack-web-development"
                  required
                />
                <TextField
                  form={form}
                  name="subtitle"
                  label="Subtitle"
                  placeholder="Brief description"
                />
                <TextField
                  form={form}
                  name="description"
                  label="Description"
                  placeholder="Detailed description..."
                  textarea
                  maxLength={80}
                />
                <TextField
                  form={form}
                  name="tags"
                  label="Tags"
                  required
                  placeholder="MERN, DSA (comma separated)"
                  keywordsHandler={true}
                />
                <TextField
                  form={form}
                  name="startTime"
                  label="Class Start Time"
                  placeholder="08:30 PM"
                  required
                />
              </div>

              {/* Settings */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-500/20">
                <SelectField
                  form={form}
                  name="duration"
                  label="Duration"
                  required
                  options={DURATION_OPTIONS}
                />
                <SelectField
                  form={form}
                  name="type"
                  label="Type"
                  required
                  options={TYPE_OPTIONS}
                />
                <SelectField
                  form={form}
                  name="status"
                  label="Status"
                  required
                  options={STATUS_OPTIONS}
                />
                <SelectField
                  form={form}
                  name="language"
                  label="Language"
                  required
                  options={LANGUAGE_OPTIONS}
                />
                <SelectField
                  form={form}
                  name="level"
                  label="Level"
                  required
                  options={LEVEL_OPTIONS}
                />
                <SelectField
                  form={form}
                  name="days"
                  label="Class Days"
                  options={DAYS_OPTIONS}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-emerald-500/20">
                <div className="col-span-2">
                  <SectionHeader title="Pricing" />
                </div>
                <TextField
                  form={form}
                  name="price"
                  label="Regular Price"
                  placeholder="9999"
                  required
                  type="number"
                  icon={IndianRupee}
                  inputClass="pl-8"
                />
                <TextField
                  form={form}
                  name="discountedPrice"
                  label="Discounted Price"
                  placeholder="6999"
                  type="number"
                  icon={IndianRupee}
                  inputClass="pl-8"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full px-8 py-5 border-t border-emerald-500/20 bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-emerald-200/60">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex items-center gap-3">
                <ButtonPrimary
                disabled={isPending}
                  size="sm"
                  variant="destructive"
                  type="button"
                  className="px-7 flex items-center gap-1"
                >
                  Cancel
                </ButtonPrimary>
                <ButtonPrimary
                disabled={isPending}
                  size="sm"
                  variant="secondary"
                  type="submit"
                  className="px-7"
                >
                  {mode === "create" && (isPending ? "Creating Course..." : "Create Course")}
                  {mode === "edit" && (isPending ? "Updating Course..." : "Update Course")}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
