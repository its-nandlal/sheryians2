import { api } from "@/lib/axios";
import { PaginationParams } from "@/module/instructor/hooks/useInstructors";
import { ApiResponse, DefaultResponse } from "@/types";
import { CourseDuration, CourseLevel } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";






// ====================== TYPES & INTERFACE =======================

export interface getCourse {
    id: string,
    title: string,
    thumbnailUrl: string,
    bannerUrl: string,
    price: number,
    discountedPrice: number,
    level: CourseLevel,
    duration: CourseDuration,
    startTime: string,
}

interface coursesResponse {
    success: boolean;
    data: getCourse[];
    total: number;
    totalPages: number,
    currentPage: number,
    limit: number,
    error?: string;
}








// ====================== API FEACTHING =======================

// get api
async function fetchCourses(
    {page, limit, search} : PaginationParams
): Promise<coursesResponse> {
    const { data } = await api.get('/courses', {
        params: {page, limit, search}
    })

    return data;
}

// get2 api
async function  fetchCourse(id:string): Promise<ApiResponse> {
    const { data } = await api.get(`/courses/${id}`)
    return data;
}

// create api
async function fetchCreateCourse(formData: FormData): Promise<DefaultResponse> {
    const { data } = await api.post("/courses", formData)
    return data;
}

// update api
async function fetchUpdateCourse(id: string, formData: FormData): Promise<ApiResponse> {
    const { data } = await api.patch(`/courses/${id}`, formData)
    return data;
}

// delete api
async function fetchDeleteCourse(id:string): Promise<ApiResponse> {
    const { data } = await api.delete(`/courses/${id}`)
    return data
}









// ====================== Qureys CREATE =======================

// get courses
export function useCourses({page, limit, search}: PaginationParams){
    return useQuery({
        queryKey: ['courses', {page, limit, search}],
        queryFn: () => fetchCourses({page, limit, search}),
        staleTime: 5 * 60 * 1000,
    })
}

// get view course
export function useCourse(id: string){
    return useQuery({
        queryKey: ['course', id],
        queryFn: ()=> fetchCourse(id),
        staleTime: 5 * 60 * 1000
    })
}

// create courses
export function useCreateCourse(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchCreateCourse(formData),
        onSuccess: (data) => {
            if(data.success){
                toast.success(data.message || "Course created successfully")
                queryClient.invalidateQueries({queryKey: ['courses']})
            } else {
                toast.error(data.error || "Created failed")
            }
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong while deleting")
        }
    })
}

// update courses
export function useUpdateCourse(id: string){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchUpdateCourse(id, formData),
        onSuccess: (data) => {
            if(data.success){
                queryClient.invalidateQueries({queryKey: ['courses']})
                toast.success(data.message || "Course updated successfully")
            } else {
                toast.error(data.error || "Updated failed ( No changes detact )")
            }
        },
        onError: (error)=>{
            toast.error(error.message || "Something went wrong while updating")
        }
    })
}

// delete course
export function useDeleteCourse(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => fetchDeleteCourse(id),
        onSuccess: (data) => {
            if(data.success){
                queryClient.invalidateQueries({queryKey: ['courses']})
                toast.success(data.message || "Course deleted successfully")
            } else {
                toast.error(data.error || "Deleted failed")
            }
        },
        onError: (error) => {
            toast.error(
                error.message 
                || "Something went wrong while deleting"
            )
        }
    })
}