
import { CloudUpload, X } from "lucide-react";
import { Input } from "../ui/input";
import { useCoursesStore } from "@/module/course/( course )/store/courses-store";
import { useCallback, useMemo } from "react";

interface FileUpload2Props {
  name: string;
  label: string;
  preview?: string | null; // edit mode preview (URL from DB)
}

export default function FileUpload2({
  name,
  label,
  preview
}: FileUpload2Props) {

  const selectedFile = useCoursesStore(
    (state) => state.selectedFiles[name]
  );
  const addFile = useCoursesStore((state) => state.addFile);
  const removeFile = useCoursesStore((state) => state.removeFile);

  const videoPreview = useMemo(() => {
    if (selectedFile?.preview !== undefined) {
      return selectedFile.preview || null;
    }
    return preview || null;
  }, [selectedFile, preview]);


  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);

      addFile({
        name,
        file,
        preview: previewUrl
      });

      e.target.value = "";
    },
    [name, addFile]
  );


  const handleRemove = useCallback(() => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    removeFile(name);
  }, [name, removeFile, selectedFile]);


  return (
    <div className="space-y-2">
      <div className="text-emerald-100 text-sm">
        {label}
      </div>

      <div className="relative w-full aspect-video bg-emerald-800/20 border-2 border-dashed border-emerald-600/40 rounded-xl hover:bg-emerald-950/40 hover:border-emerald-500 transition-all overflow-hidden cursor-pointer group">

        <Input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />

        {videoPreview ? (
          <div className="relative w-full h-full">
            <video
              src={videoPreview}
              className="w-full h-full object-cover"
              controls
            />

            <div className="absolute top-2 left-0 p-1 px-2 w-full flex items-center justify-between opacity-0 group-hover:opacity-100 ease-in-out duration-200">

            {selectedFile && (
              <div className=" bg-black/70 px-2 rounded text-xs text-emerald-100">
                {selectedFile.file?.name}
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 bg-red-900/90 hover:bg-red-700 rounded-full"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            </div>


          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 pointer-events-none">
            <CloudUpload className="w-10 h-10 text-emerald-400" />
            <p className="text-sm text-emerald-100">
              Drop {label.toLowerCase()} here
            </p>
            <p className="text-xs text-emerald-300/60">
              MP4 / MOV up to 1.5GB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
