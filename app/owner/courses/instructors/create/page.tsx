"use client"

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { CreateInstructorInput, createInstructorSchema } from '@/module/instructor/types/instructor'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ButtonPrimary from '@/components/ui/button-primary'
import { ImageUp } from 'lucide-react'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useCreateInstructor } from '@/module/instructor/hooks/useInstructors'

export default function InstructorCreate() {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: createInstructor, data: resdata, isPending } = useCreateInstructor()

  const form = useForm<CreateInstructorInput>({
    resolver: zodResolver(createInstructorSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      expertise: [],
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return;

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onSubmit = (data: CreateInstructorInput) => {
    try {
      const formData = new FormData()
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("bio", data.bio || "");
      formData.append("expertise", JSON.stringify(data.expertise));

      if(fileInputRef.current?.files?.[0]) {
        formData.append("avatar", fileInputRef.current.files[0])
      }

      createInstructor(formData)
      
    } catch (error) {
      toast.error(error instanceof Error ? resdata?.message : "Something went wrong")
    } finally {
      form.reset()
      setPreview(null)
    }
  }

  return (
    <section className='w-full h-screen overflow-hidden'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full h-full grid grid-cols-3 gap-2 p-2'
        >
          {/* LEFT SIDE - Information Panel */}
          <div className='w-full h-full p-8 bg-linear-to-tr from-[#004934d7] to-[#001b12e1] backdrop-blur-md border border-[#00835e]/20 col-span-2 rounded-4xl overflow-y-auto'>
            <div className='space-y-6'>
              {/* Header */}
              <div className='space-y-3'>
                <h1 className='text-6xl font-[NeueMachina] leading-tight bg-linear-to-r from-white to-[#00835e] bg-clip-text text-transparent'>
                  Create Instructor
                </h1>
                <div className='w-20 h-1 bg-linear-to-r from-[#00835e] to-transparent rounded-full'></div>
              </div>

              {/* Description Section */}
              <div className='space-y-4 pt-4'>
                <p className='text-xl font-[Helvetica] tracking-wide leading-relaxed text-white/90'>
                  Create an instructor profile to enable course creation and teaching capabilities within the platform.
                </p>
                
                <div className='space-y-4 text-base font-[Helvetica] leading-relaxed text-white/80'>
                  <p>
                    Instructors play a vital role in our educational ecosystem. They bring expertise, knowledge, and real-world experience to create engaging learning experiences for students across various disciplines.
                  </p>
                  
                  <p className='text-justify'>
                    When creating an instructor profile, you&apos;ll provide essential information including their name, email, professional biography, and areas of expertise. This information helps students understand the instructor&apos;s background and qualifications before enrolling in their courses.
                  </p>
                  <p className='text-justify'>
                    The instructor&apos;s avatar provides a personal touch to their profile, making the learning experience more engaging and building trust with students. A complete profile with detailed expertise tags helps students find the right courses that match their learning goals and interests.
                  </p>

                  <div className='bg-[#00835e]/10 border border-[#00835e]/30 rounded-2xl p-6 mt-6'>
                    <h3 className='text-lg font-[NeueMachina] mb-3 text-[#00835e]'>Key Requirements</h3>
                    <ul className='space-y-2 text-white/80'>
                      <li className='flex items-start gap-2'>
                        <span className='text-[#00835e] mt-1'>•</span>
                        <span>Valid email address for communication and account management</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-[#00835e] mt-1'>•</span>
                        <span>Professional biography highlighting qualifications and experience</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-[#00835e] mt-1'>•</span>
                        <span>Expertise areas as comma-separated tags (e.g., React, Next.js, TypeScript)</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-[#00835e] mt-1'>•</span>
                        <span>Professional avatar image for profile identification</span>
                      </li>
                    </ul>
                  </div>

                  <p className='text-justify pt-4'>
                    Once the instructor profile is created, they can immediately begin creating courses, uploading content, and engaging with students. The platform provides comprehensive tools for course management, student interaction, and performance tracking to ensure successful teaching outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Form Panel */}
          <div className='w-full h-full p-6 bg-linear-to-tr from-[#001b12e1] to-[#004934d7] backdrop-blur-md border border-[#00835e]/20 rounded-4xl overflow-y-auto'>
            <div className='space-y-6'>
              {/* Avatar Upload Section */}
              <div className='w-full py-6 bg-linear-to-br from-[#00835e]/5 to-transparent backdrop-blur-sm border border-[#00835e]/20 rounded-2xl flex items-center justify-center'>
                <div className='relative'>
                  <div className='w-40 h-40 relative bg-linear-to-br from-[#001b12] to-[#004934] rounded-full border-2 border-[#00835e]/30 overflow-hidden'>
                    {preview ? (
                      <Image
                        src={preview}
                        alt='preview'
                        width={200}
                        height={200}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <ImageUp className='w-12 h-12 text-[#00835e]/40' />
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className='absolute bottom-0 right-0 bg-linear-to-br from-[#00835e] to-[#004934] p-3 rounded-full border-2 border-[#001b12] hover:shadow-md hover:shadow-[#00835e]/30 transition-all duration-200 cursor-pointer group'>
                    <ImageUp className='w-5 h-5 group-hover:scale-110 transition-transform' />
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <FormField 
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className='text-sm font-[Helvetica] text-white/90'>Name</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Enter instructor name'
                        className='bg-[#001b12]/40 backdrop-blur-sm border-[#00835e]/30 focus:border-[#00835e] transition-colors'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField 
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className='text-sm font-[Helvetica] text-white/90'>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='example@mail.com'
                        className='bg-[#001b12]/40 backdrop-blur-sm border-[#00835e]/30 focus:border-[#00835e] transition-colors'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField 
                control={form.control}
                name="bio"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className='text-sm font-[Helvetica] text-white/90'>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Instructor's professional background and expertise..."
                        value={field.value ?? ""}
                        className='min-h-32 bg-[#001b12]/40 backdrop-blur-sm border-[#00835e]/30 focus:border-[#00835e] transition-colors resize-none' 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField 
                control={form.control}
                name="expertise"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className='text-sm font-[Helvetica] text-white/90'>Expertise</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder='React, Next.js, TypeScript'
                        className='bg-[#001b12]/40 backdrop-blur-sm border-[#00835e]/30 focus:border-[#00835e] transition-colors'
                        value={field.value?.join(", ") ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",")
                            .map(v=> v.trim())
                            .filter(Boolean)
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <ButtonPrimary
                disabled={isPending} 
                type="submit"
                size={"sm"} 
                variant={"outline"}
                className='w-full mt-6 bg-[#00835e]/40  transition-all duration-200'
              >
                {isPending ? "Creating..." : "Create Instructor"}
              </ButtonPrimary>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}
