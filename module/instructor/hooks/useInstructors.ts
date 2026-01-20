import { api } from "@/lib/axios";
import { Instructor } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



// Params Instructors

export interface PaginationParams {
    page:       number;
    limit:      number;
    search?:    string;
    courseId?:  string;
}


// Responst Interface

interface GetInstructorResponse {
    success: boolean;
    data: Instructor[];
    total: number;
    totalPages: number,
    currentPage: number,
    limit: number,
    error?: string;
}

interface InstructorResponse {
    success: boolean;
    message: string;
    error?: string;
}






// ===============  API FEATCHING  ===================

async function fetchGetInstructors (
    {page, limit, search}
    : PaginationParams): Promise<GetInstructorResponse> {
    const { data } = await api.get('/instructors', {
        params: {
            page,
            limit,
            search,
        }
    })

    return data;
}

async function fetchCreateInstructor(formData : FormData): Promise<InstructorResponse> {
    const { data } = await api.post('/instructors', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    return data;
}

async function fetchUpdatingInstructor(id: string, formData: FormData): Promise<InstructorResponse> {
    const { data } = await api.patch(`/instructors/${id}`, formData,)
    return data; 
}

async function fetchDeleteInstructor(id: string): Promise<InstructorResponse> {
    const { data } = await api.delete(`/instructors/${id}`)
    return data;
}




// ===============  Create Qurey  ===================

// GET Instructors
export function useInstructors({page = 1, limit = 9, search = ''}: PaginationParams){
    return useQuery({
        queryKey: ['instructors', page, limit, search],
        queryFn: () => fetchGetInstructors({page, limit, search}),
        staleTime: 5 * 60 * 1000,
        // keepPreviousData: true,
    })
}


// Cretae Instructor
export function useCreateInstructor(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchCreateInstructor(formData),
        onSuccess: (data) => {
            if(data.success){
                toast.success(data.message || "Instructor created successfully")
                queryClient.invalidateQueries({queryKey: ['instructors']})
            } else {
                toast.error(data.error || "Created failed")
            }
        },
        onError: () => {
            toast.error("Something went wrong while deleting")
        }
    })
}


// Updating Instructor
export function useUpdatingInstructor(id: string){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchUpdatingInstructor(id, formData),
        onSuccess: (data) => {
            if(data.success){
                toast.success(data.message || "Instructor updated successfully")
                queryClient.invalidateQueries({queryKey: ['instructors']})
            } else {
                toast.error(data.error || "Updated failed")
            }
        },
        onError: () => {
            toast.error("Something went wrong while updating")
        }
    })
}

// DELETE Instructor
export function useDeleteInstructor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchDeleteInstructor(id),

    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Instructor deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["instructors"] });
      } else {
        toast.error(data.error || "Delete failed");
      }
    },

    onError: () => {
      toast.error("Something went wrong while deleting");
    },
  });
}