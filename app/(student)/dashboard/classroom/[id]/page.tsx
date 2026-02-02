"use client"

import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useViewEnrollmentCourse } from "@/module/(students)/enrollment/view/hooks"
import { AccordionTrigger } from "@radix-ui/react-accordion"
import { Loader2, PlayCircle } from "lucide-react"
import { use, useState } from "react"

export default function ClassroomModule({params}: {params: Promise<{id: string}>}) {

  const {id} = use(params)

  const [videoURL, setVideoURL] = useState<string | null>(null)

  const {data: enrollmentCourse, isPending, isError} = useViewEnrollmentCourse(id)

  if(isPending) return <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin" />
  </div>

  if(isError) return <div className="w-full h-full flex flex-col items-center justify-center">{isError}</div>

  return (
    <div className="w-full h-full p-2 md:p-4">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Video Section */}
        <Card className="h-fit text-emerald-200 bg-emerald-800/40 backdrop-blur-md border-emerald-700/50">
          <CardHeader>
            <CardTitle className="text-xl font-[NeueMachina]">Video Player</CardTitle>
          </CardHeader>
          <CardContent className="max-md:px-2">
            <div className="w-full aspect-video bg-emerald-800/50 rounded-lg flex items-center justify-center">
              {videoURL ? (
                <>
                <video
                src={videoURL}
                controls
                className="w-full h-full object-cover"
                />
                </>
              ) : (
                <>
                  <PlayCircle className="w-16 h-16 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Video Placeholder</span>
                </>
              )}

            </div>
          </CardContent>
        </Card>

        {/* Modules Section */}
        <Card className="h-fit text-emerald-200 bg-emerald-800/40 backdrop-blur-md border-emerald-700/50">
          <CardHeader>
            <CardTitle>Course Modules</CardTitle>
          </CardHeader>
          <CardContent className="max-md:px-3">
            <Accordion 
              collapsible
              type="single"
              className="w-full space-y-4">
              {enrollmentCourse.data?.modules.map((module) => (
                <AccordionItem 
                  className="border border-emerald-700/50 rounded-lg"
                  key={module.id} 
                  value={`module-${module.id}`}>
                  <AccordionTrigger className="w-full text-start px-4 py-2 rounded-t-lg hover:bg-emerald-700 ">
                    <h2 className="text-lg font-semibold font-[NeueMachina]">
                      {module.title}
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {module.chapter.map(chapter => (
                        <div 
                          onClick={() => setVideoURL(chapter.videoUrl || "")}
                          className="w-full p-3 flex items-center gap-4 bg-emerald-800 rounded-md cursor-pointer transition-colors"
                          key={chapter.id}>
                          <PlayCircle className="w-5 h-5 text-primary" />
                          <span className="capitalize font-[Helvetica]">{chapter.title}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}