import dynamic from "next/dynamic";

import { memo } from "react";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Instructor } from "@prisma/client";
import { Mail, Trash2, UserRoundPen } from "lucide-react";
import Image from "next/image";
import ImagePlaceHolder from "@/assets/image-place-holder.jpg";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/components/layout/alert-dialog";
import { useDeleteInstructor } from "../hooks/useInstructors";

// import InstructorFormDialog from "./ui/InstructorFormDialog";

const InstructorFormDialog = dynamic(() => import("./InstructorFormDialog"), {
  ssr: true,
  loading: () => null,
});

interface InstructorCardProps {
  instructor?: Instructor;
  className?: string;
}

function InstructorCard({ instructor, className }: InstructorCardProps) {
  const { mutate: deleteInstructor } = useDeleteInstructor();

  const handleDelete = (id: string) => {
    deleteInstructor(id);
  };

  return (
    <article
      className={cn(
        "relative group w-full h-full p-4 rounded-2xl bg-linear-to-br from-emerald-950/70 via-[#002a1e]/80 to-black/80 backdrop-blur-xl border border-emerald-800/40 shadow-inner shadow-emerald-500/10 text-zinc-100 grid grid-rows-[auto_1fr] gap-4 hover:scale-[1.02] ease-initial duration-500 cursor-pointer overflow-hidden",
        className
      )}
    >
      {instructor && (
        <>
          {/* Top Section */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-20 h-20 rounded-full overflow-hidden border border-emerald-700/50 bg-emerald-900/30",
                !instructor.avatarUrl && "opacity-20"
              )}
            >
              <Image
                src={instructor.avatarUrl || ImagePlaceHolder}
                alt={instructor.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-[NeueMachina] tracking-wide">
                {instructor.name}
              </h3>

              <p className="text-sm font-[Helvetica] text-emerald-300/70 flex items-center gap-1.5 lowercase">
                <Mail className="w-4 h-4" />
                {instructor.email}
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-3">
            <p className="text-sm font-[Helvetica] font-light  leading-none text-zinc-200/90 p-2 rounded-md bg-emerald-900/30 border border-emerald-800/30">
              {instructor.bio}
            </p>

            <div className="flex flex-wrap gap-2">
              {instructor.expertise.map((expertise, index) => (
                <Badge
                  key={index}
                  className="text-xs font-[Helvetica] text-emerald-300/90 px-3 py-1"
                >
                  {expertise}
                </Badge>
              ))}
            </div>
          </div>

          {/* Hover Action */}
          <div
            className="
              absolute top-0 right-0
              px-3 py-2
              flex items-center gap-2
              rounded-full
              bg-emerald-950/70
              backdrop-blur-xl
              border border-emerald-700/30
              shadow-lg shadow-emerald-900/40

              opacity-0 scale-70
              group-hover:opacity-100 group-hover:scale-85
              transition-all duration-300 ease-out"
          >
            {/* Edit */}

            <InstructorFormDialog mode="edit" defaultValues={instructor}>
              <Button
                variant="ghost"
                className="
                p-1
                rounded-full
                bg-emerald-900/60
                hover:bg-emerald-600
                hover:text-black
                transition"
              >
                <UserRoundPen className="w-3 h-3" />
              </Button>
            </InstructorFormDialog>

            <AlertMessage
              title="Delete this course?"
              description="This action cannot be undone. This will permanently delete the course and all its associated data."
              onConfirm={() => handleDelete(instructor.id)}
              onConfirmText="Delete"
            >
              {/* Delete */}
              <Button
                variant="ghost"
                className="
                p-1
                rounded-full
                bg-red-900/30
                hover:bg-red-600
                hover:text-white
                transition"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertMessage>
          </div>
        </>
      )}
    </article>
  );
}

/* ✅ Memoized export */
export default memo(InstructorCard);
