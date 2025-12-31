"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateInstructor } from "@/hooks/use-instructors"
import { CreateInstructorInput } from "@/types/instructor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ImageKitUpload from "@/components/layout/imagekit-upload"
import { Loader2, Plus, X } from "lucide-react"

export default function CreateInstructorPage() {
  const router = useRouter()
  const createInstructor = useCreateInstructor()

  const [formData, setFormData] = useState<CreateInstructorInput>({
    name: "",
    email: "",
    avatarUrl: null,
    bio: null,
    expertise: [],
  })

  const [expertiseInput, setExpertiseInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (formData.bio && formData.bio.length < 10) {
      newErrors.bio = "Bio must be at least 10 characters"
    }

    if (formData.expertise.length === 0) {
      newErrors.expertise = "Add at least one expertise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addExpertise = () => {
    const trimmed = expertiseInput.trim()
    if (trimmed && !formData.expertise.includes(trimmed)) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, trimmed],
      })
      setExpertiseInput("")
      setErrors({ ...errors, expertise: "" })
    }
  }

  const removeExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await createInstructor.mutateAsync(formData)
      router.push("/owner/instructors")
    } catch (error) {
      if(error instanceof Error){
            console.log(error.message)
            return
        }
        console.error("An unknown error occurred.")
      // Error handled in mutation
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Instructor
          </h1>
          <p className="text-gray-600 mb-8">
            Add a new instructor to your platform
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div>
              <ImageKitUpload
                label="Profile Picture"
                folder="/instructors/avatars"
                currentImage={formData.avatarUrl}
                onSuccess={(url) =>
                  setFormData({ ...formData, avatarUrl: url })
                }
                onRemove={() => setFormData({ ...formData, avatarUrl: null })}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setErrors({ ...errors, name: "" })
                }}
                placeholder="John Doe"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setErrors({ ...errors, email: "" })
                }}
                placeholder="john@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <Textarea
                value={formData.bio || ""}
                onChange={(e) => {
                  setFormData({ ...formData, bio: e.target.value })
                  setErrors({ ...errors, bio: "" })
                }}
                placeholder="Tell us about the instructor..."
                rows={4}
                className={errors.bio ? "border-red-500" : ""}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
              )}
            </div>

            {/* Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expertise *
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addExpertise()
                    }
                  }}
                  placeholder="e.g., React, Node.js, TypeScript"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addExpertise}
                  variant="outline"
                  disabled={!expertiseInput.trim()}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeExpertise(index)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {errors.expertise && (
                <p className="mt-2 text-sm text-red-600">{errors.expertise}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createInstructor.isPending}
                className="flex-1"
              >
                {createInstructor.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Instructor"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
