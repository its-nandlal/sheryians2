"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { CreateInstructorInput, createInstructorSchema } from "@/types/instructor";
import axios from "axios";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import ImageKitUpload from "@/components/layout/ImageKitUpload";
import { useState } from "react";
import Image from "next/image";

export default function CreateInstructor() {
  const [instructorId, setInstructorId] = useState<string | null>(null);

  const form = useForm<CreateInstructorInput>({
    resolver: zodResolver(createInstructorSchema) as Resolver<CreateInstructorInput>,
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      expertise: [],
      avatarUrl: null,
      avatarFileId: null,
    },
  });

  const onSubmit = async (data: CreateInstructorInput) => {
    try {
      const response = await axios.post("/api/instructor/create", {
        name: data.name,
        email: data.email,
        bio: data.bio,
        expertise: data.expertise,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setInstructorId(response.data.data.id);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Failed to create instructor:", err);
      toast.error("Failed to create instructor");
    }
  };

  const avatarUrl = form.watch("avatarUrl");

  return (
    <div className="w-full max-h-screen h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full grid grid-cols-2"
        >
          {/* LEFT PREVIEW */}
          <div className="w-full h-screen bg-orange-900 flex items-center justify-center p-8">
            {avatarUrl ? (
              <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={avatarUrl}
                  alt="Instructor preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="text-white text-center">
                <p className="text-xl">Upload image to see preview</p>
              </div>
            )}
          </div>

          {/* RIGHT FORM */}
          <div className="w-full h-screen overflow-y-auto p-8 space-y-6">
            <h2 className="text-2xl font-bold mb-6">Create New Instructor</h2>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Enter instructor name"
                      className="w-full px-4 py-2 border rounded-md"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      placeholder="Enter instructor email"
                      className="w-full px-4 py-2 border rounded-md"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter instructor bio"
                      className="w-full min-h-24"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertise</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Enter expertise (comma separated)"
                      className="w-full px-4 py-2 border rounded-md"
                      value={field.value?.join(", ") ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={form.formState.isSubmitting || !!instructorId}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold disabled:bg-gray-400"
              >
                {form.formState.isSubmitting
                  ? "Creating..."
                  : instructorId
                  ? "Instructor Created"
                  : "Create Instructor"}
              </button>
            </div>

            {/* IMAGE UPLOAD */}
            {instructorId && (
              <div className="border-t pt-6 mt-6">
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => {
                    const avatarFileId = form.getValues("avatarFileId");

                    return (
                      <ImageKitUpload
                        label="Instructor Avatar"
                        value={
                          field.value
                            ? { url: field.value, fileId: avatarFileId || "" }
                            : null
                        }
                        onChange={(data) => {
                          field.onChange(data?.url ?? null);
                          form.setValue("avatarFileId", data?.fileId ?? null);
                        }}
                        folder="instructors"
                        instructorId={instructorId}
                      />
                    );
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
