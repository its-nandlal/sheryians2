import { useCallback } from "react" // 👈 Removed useEffect
import { Input } from "@/components/ui/input"
import { CloudUpload, X } from "lucide-react"
import Image from "next/image"
import { useCoursesStore } from "../../store/courses-store"

interface FileUploadProps {
  name: string
  label: string
}

export function FileUpload({ name, label }: FileUploadProps) {
  const selectedFile = useCoursesStore((state) => state.selectedFiles[name])
  const addFile = useCoursesStore((state) => state.addFile)
  const removeFile = useCoursesStore((state) => state.removeFile)
  
  const preview = selectedFile?.preview || null // 👈 Derived value

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onloadend = () => {
        addFile({
          name,
          file,
          preview: reader.result as string
        })
      }
      reader.readAsDataURL(file)

      e.target.value = ""
    },
    [name, addFile]
  )

  const handleRemove = useCallback(() => {
    removeFile(name)
  }, [name, removeFile])

  return (
    <div>
      <div className="text-emerald-100 text-sm">
        {label}
      </div>

      <div className="relative w-full aspect-video bg-emerald-800/20 border-2 border-dashed border-emerald-600/40 rounded-xl hover:bg-emerald-950/40 hover:border-emerald-500 transition-all overflow-hidden cursor-pointer group">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full h-full opacity-0 cursor-pointer"
        />

        <div className="absolute inset-0 pointer-events-none">
          {preview ? (
            <div className="relative w-full h-full">
              <Image
                src={preview}
                alt={`${label} preview`}
                fill
                className="object-cover"
              />

              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-900/90 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition pointer-events-auto"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {selectedFile && (
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-emerald-100">
                  {selectedFile.file?.name}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <CloudUpload className="w-10 h-10 text-emerald-400" />
              <p className="text-sm text-emerald-100">
                Drop {label.toLowerCase()} here
              </p>
              <p className="text-xs text-emerald-300/60">
                PNG / JPG up to 2MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
