import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { CreateInstructorInput, Instructor } from "@/types/instructor"
import { toast } from "sonner"

export const instructorKeys = {
  all: ["instructors"] as const,
  lists: () => [...instructorKeys.all, "list"] as const,
  list: () => [...instructorKeys.lists()] as const,
  details: () => [...instructorKeys.all, "detail"] as const,
  detail: (id: string) => [...instructorKeys.details(), id] as const,
}

// Get all instructors
export function useInstructors() {
  return useQuery({
    queryKey: instructorKeys.list(),
    queryFn: async () => {
      const { data } = await apiClient.get<{
        success: boolean
        data: Instructor[]
      }>("/instructors")
      return data.data
    },
  })
}

// Get single instructor
export function useInstructor(id: string) {
  return useQuery({
    queryKey: instructorKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<{
        success: boolean
        data: Instructor
      }>(`/instructors/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

// Create instructor
export function useCreateInstructor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateInstructorInput) => {
      const { data } = await apiClient.post<{
        success: boolean
        data: Instructor
        message: string
      }>("/instructors", input)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.lists() })
      toast.success(data.message || "Instructor created successfully!")
    },
    onError: (error) => {
        if(error instanceof Error){
            toast.error(error.message)
            return
        }
      const errorMessage =
        "Failed to create instructor"
      toast.error(errorMessage)
    },
  })
}

// Update instructor
export function useUpdateInstructor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<CreateInstructorInput>
    }) => {
      const response = await apiClient.patch<{
        success: boolean
        data: Instructor
        message: string
      }>(`/instructors/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: instructorKeys.detail(data.data.id),
      })
      toast.success(data.message || "Instructor updated successfully!")
    },
    onError: (error) => {
        if(error instanceof Error){
            toast.error(error.message)
            return
        }
      toast.error("Failed to update instructor")
    },
  })
}

// Delete instructor
export function useDeleteInstructor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<{
        success: boolean
        message: string
      }>(`/instructors/${id}`)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.lists() })
      toast.success(data.message || "Instructor deleted successfully!")
    },
    onError: (error) => {
        if(error instanceof Error){
            toast.error(error.message)
            return
        }
      toast.error("Failed to delete instructor")
    },
  })
}
