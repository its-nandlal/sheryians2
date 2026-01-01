"use client";

import { useState, useRef, useEffect } from "react";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

interface ImageKitUploadProps {
  value?: { url: string; fileId: string } | null;
  onChange?: (data: { url: string; fileId: string } | null) => void;
  folder?: string;
  label?: string;
  instructorId?: string;
}

export default function ImageKitUpload({
  value,
  onChange,
  folder = "instructors",
  label = "Upload Image",
  instructorId,
}: ImageKitUploadProps) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value?.url || null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /* ---------------- Sync preview if value changes ---------------- */
  useEffect(() => {
    setPreview(value?.url || null);
  }, [value]);

  /* ---------------- Get auth params from server ---------------- */
  const authenticator = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) throw new Error("Failed to get upload auth");
    return res.json(); // { token, expire, signature }
  };

  /* ---------------- File select preview ---------------- */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ---------------- Upload to ImageKit ---------------- */
  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      setError("Please select an image");
      return;
    }

    if (!instructorId) {
      setError("Please create instructor first");
      return;
    }

    const file = fileInputRef.current.files[0];
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const auth = await authenticator();

      const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
      if (!publicKey) throw new Error("ImageKit public key missing");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", publicKey);
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire.toString());
      formData.append("token", auth.token);
      formData.append("folder", folder); // ✅ no slash

      abortControllerRef.current = new AbortController();
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);

        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          onChange?.({ url: res.url, fileId: res.fileId });
          setPreview(res.url);
        } else {
          const err = JSON.parse(xhr.responseText);
          setError(err.message || "Upload failed");
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setError("Network error during upload");
      };

      xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
      xhr.send(formData);
    } catch (err: any) {
      setUploading(false);
      setError(err.message || "Upload failed");
    }
  };

  /* ---------------- Cancel upload ---------------- */
  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setUploading(false);
    setProgress(0);
  };

  /* ---------------- Remove image ---------------- */
  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || !instructorId}
            className="w-full file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {!instructorId && (
            <p className="text-sm text-amber-600">
              Save instructor before uploading image
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {preview && (
            <div className="relative w-32 h-32 rounded-md overflow-hidden border">
              <img src={preview} className="w-full h-full object-cover" />
              {!uploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {uploading && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !fileInputRef.current?.files?.[0]}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

            {uploading && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </FormControl>
    </FormItem>
  );
}
