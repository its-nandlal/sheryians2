import { api } from "@/lib/axios";
import { PaginationParams } from "@/module/instructor/hooks/useInstructors";
import { ApiError, ApiResponse } from "@/types";
import { Module } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";




// ====================== TYPES & INTERFACE =======================

export interface getModulesProps {
    success: boolean,
    message: string,
    data: Module[],
    total: number,
    totalPages: number,
    currentPage: number,
    limit: number,
    error: string
}

export type getModuleResponse = getModulesProps | ApiError




// ====================== API FEACTHING =======================

// get api
async function fetchModules(
    {page, limit, search, courseId}: PaginationParams
): Promise<getModulesProps> {
    const { data } = await api.get("/courses/modules", 
    {params: {page, limit, search, courseId} })

    return data;
}

// create api
async function fetchModuleCreate(formData: FormData): Promise<ApiResponse> {
    const { data } = await api.post("/courses/modules", formData)
    return data
}

// update api
async function fetchModuleUpdate(id: string, formData: FormData): Promise<ApiResponse> {
    const { data } = await api.patch(`/courses/modules/${id}`, formData)
    return data
}

// delete api
async function fetchModuleDelete(id: string) {
    const { data } = await api.delete(`/courses/modules/${id}`)
    return data
}







// ====================== Qureys CREATE =======================

// get modules
export const useModules = ({page, limit, search, courseId}: PaginationParams) => {
    return useQuery({
        queryKey: ["modules", {page, limit, search, courseId}],
        queryFn: () => fetchModules({page, limit, search, courseId}),
        staleTime: 5 * 60 * 1000,
    })
}

// create module
export const useModuleCreate = () => {
    const queryKey = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchModuleCreate(formData),
        onSuccess: (data) => {
            if(data.success){
                queryKey.invalidateQueries({queryKey: ["modules"]})
                toast.success(data.message || "Module created successfully")
            } else {
                toast.error(data.error || "Creating failed.")
        }},
        onError: (err) =>{
            toast.error(err.message || "Somthing went wrong while creating.")
        }
    })
}

// update module
export const useModuleUpdate = (id: string) => {
    const qureyKey = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => fetchModuleUpdate(id, formData),
        onSuccess: (data) => {
            if(data.success){
                qureyKey.invalidateQueries({queryKey: ["modules"]})
                toast.success(data.message || "Module updated successfully")
            } else {
                toast.error(data.error || "Updating failed.")
        }},
        onError: (err) => {
            toast.error(err.message || "Somthing went wrong while updating.")
        }
    })
}

// delete module
export const useModuleDelete = () => {
    const queryKey = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => fetchModuleDelete(id),
        onSuccess: (data) => {
            if(data.success){
                queryKey.invalidateQueries({queryKey: ["modules"]})
                toast.success(data.message || "Module deleted successfully")
            } else {
                toast.error(data.error || "Deleting failed.")
        }},
        onError: (err) => {
            toast.error(err.message || "Somthing went wrong while deleting.")
        }
    })
}