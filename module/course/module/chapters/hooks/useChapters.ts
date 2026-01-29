import { api } from "@/lib/axios";
import { PaginationParams } from "@/module/instructor/hooks/useInstructors";
import { ApiError, ApiResponse } from "@/types";
import { Chapter } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";




// ====================== TYPES & INTERFACE =======================


export interface getChaptersProps {
    success: boolean,
    message: string,
    data: Chapter[],
    total: number,
    totalPages: number,
    currentPage: number,
    limit: number,
    error: string
}

export type getModuleResponse = getChaptersProps | ApiError










// ====================== API FEATCHING =======================

// get api
async function fetchChapters(
    {page, limit, search, id: chapterId }: PaginationParams
): Promise<getChaptersProps> {
    const { data } = await api.get(`/courses/modules/chapters`,{
        params: {page,limit,search, chapterId}
    })
    return data
}

// create api
async function fetchCreateChapters(formData: FormData): Promise<ApiResponse> {
    const { data } = await api.post(`/courses/modules/chapters`, formData)
    return data
}

// update api
async function fetchUpdateChapters(id: string, formData: FormData): Promise<ApiResponse> {
    const { data } = await api.patch(`/courses/modules/chapters/${id}`, formData)
    return data
}

// delete api
async function fetchDeleteChapters(id: string): Promise<ApiResponse> {
    const { data } = await api.delete(`/courses/modules/chapters/${id}`)
    return data
}









// ====================== QUREY CREAATE =======================

// get chapters
export const useChapters = ({page, limit, search, id: chapterId}: PaginationParams) => {
    return useQuery({
        queryKey: ['chapters', {page, limit, search, chapterId}],
        queryFn: () => fetchChapters({page, limit, search, id: chapterId}),
        staleTime: 5 * 60 * 1000
    })
}

// create chapters
export const useCreateChapters = () => {
    const queryKey = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchCreateChapters(formData),
        onSuccess: ( data ) => {
            if(data.success) {
                queryKey.invalidateQueries({queryKey: ['chapters']})
                toast.success(data.message || "Chapter created successfully")
            } else {
                toast.error(data.error || "Creating failed.")
            }
        },
        onError: (err) => {
            toast.error(err.message || "Somthing went wrong while creating chapter.")
        }
    })
}

// update chapters
export const useUpdateChapters = (id: string) => {
    const queryKey = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchUpdateChapters(id, formData),
        onSuccess: ( data ) => {
            if(data.success) {
                queryKey.invalidateQueries({queryKey: ['chapters']})
                toast.success(data.message || "Chapter updated successfully")
            } else {
                toast.error(data.error || "Updating failed.")
            }
        },
        onError: (err) => {
            toast.error(err.message || "Somthing went wrong while updating chapter.")
        }
    })
}

// delete chapter
export const useDeleteChapters = () => {
    const queryKey = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => fetchDeleteChapters(id),
        onSuccess: (data) => {
            if(data.success){
                queryKey.invalidateQueries({queryKey: ['chapters']})
                toast.success(data.message || "Chapter deleted successfully")
            } else {
                toast.error(data.error || "Deleting failed.")
            }
        },
        onError: (err) => {
            toast.error(err.message || "Somthing went wrong while deleting chapter.")
        }
    })
}