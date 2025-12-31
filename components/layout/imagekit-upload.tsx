"use client"

import { useState, useCallback } from "react"
import { IKContext, IKUpload } from "imagekitio-react"
import { toast } from "sonner"
import { Loader2, Upload, X, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ImageKitUploadProps {
  onSuccess: (url: string, fileId: string) => void
  currentImage?: string | null
  onRemove?: () => void
  folder?: string
  label?: string
}

export default function ImageKitUpload({
  onSuccess,
  currentImage,
  onRemove,
  folder = "/instructors/avatars",
  label = "Upload Avatar",
}: ImageKitUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [authError, setAuthError] = useState<string | null>(null)

  const authenticator = useCallback(async () => {
    try {
      setAuthError(null)
      console.log("Fetching ImageKit auth...")
      
      const response = await fetch("/api/imagekit/auth", {
        method: "GET",
        credentials: "include", // Important for cookies
      })

      console.log("Auth response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Auth failed:", errorData)
        
        throw new Error(
          errorData.error || 
          `Authentication failed with status ${response.status}`
        )
      }

      const data = await response.json()
      
      // Validate response data
      if (!data.signature || !data.expire || !data.token) {
        throw new Error("Invalid authentication response")
      }

      console.log("Auth successful")
      
      return {
        signature: data.signature,
        expire: data.expire,
        token: data.token,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed"
      console.error("ImageKit auth error:", errorMessage)
      setAuthError(errorMessage)
      toast.error(errorMessage)
      throw error
    }
  }, [])

  const onError = (err: { message?: string } | Error) => {
    console.error("Upload error:", err)
    setUploading(false)
    setProgress(0)
    
    const errorMessage = err instanceof Error ? err.message : err?.message || "Failed to upload image"
    toast.error(errorMessage)
  }

  const onUploadSuccess = (res: { url: string; fileId: string }) => {
    console.log("Upload success:", res)
    setUploading(false)
    setProgress(100)
    setPreview(res.url)
    onSuccess(res.url, res.fileId)
    
    setTimeout(() => {
      setProgress(0)
    }, 1000)
    
    toast.success("Image uploaded successfully!")
  }

  const onUploadStart = () => {
    console.log("Upload started")
    setUploading(true)
    setProgress(0)
  }

  const onUploadProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable) {
      const percentCompleted = Math.round((evt.loaded * 100) / evt.total)
      setProgress(percentCompleted)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setProgress(0)
    if (onRemove) {
      onRemove()
    }
  }

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

  if (!publicKey || !urlEndpoint) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded-lg bg-red-50">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Configuration Error</p>
            <p className="text-sm mt-1">
              ImageKit environment variables are missing:
            </p>
            <ul className="text-xs mt-1 space-y-1">
              {!publicKey && <li>• NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY</li>}
              {!urlEndpoint && <li>• NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT</li>}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="text-amber-600 p-4 border border-amber-300 rounded-lg bg-amber-50">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Authentication Error</p>
            <p className="text-sm mt-1">{authError}</p>
            <button
              onClick={() => setAuthError(null)}
              className="text-xs underline mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {preview ? (
        <div className="relative inline-block group">
          <Image
            src={preview}
            alt="Preview"
            width={200}
            height={200}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 group-hover:border-gray-300 transition-colors"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <IKContext
          publicKey={publicKey}
          urlEndpoint={urlEndpoint}
          authenticator={authenticator}
        >
          <div className="space-y-3">
            <IKUpload
              fileName={`instructor-${Date.now()}.jpg`}
              folder={folder}
              onError={onError}
              onSuccess={onUploadSuccess}
              onUploadStart={onUploadStart}
              onUploadProgress={onUploadProgress}
              className="hidden"
              id="imagekit-upload"
              accept="image/*"
              validateFile={(file: File) => {
                if (file.size > 5 * 1024 * 1024) {
                  toast.error("File size must be less than 5MB")
                  return false
                }
                if (!file.type.startsWith("image/")) {
                  toast.error("Only image files are allowed")
                  return false
                }
                return true
              }}
            />
            <label
              htmlFor="imagekit-upload"
              className={`
                flex flex-col items-center gap-3 px-8 py-6 border-2 border-dashed 
                rounded-xl cursor-pointer transition-all
                ${
                  uploading
                    ? "border-blue-500 bg-blue-50 cursor-wait"
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                }
              `}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </>
              )}
            </label>
          </div>
        </IKContext>
      )}
    </div>
  )
}
