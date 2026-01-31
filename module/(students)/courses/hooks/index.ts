




// ====================== TYPES & INTERFACE =======================

import { api } from "@/lib/axios";
import { Course } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface coursesResponse {
    success: boolean;
    data: Course;
    error?: string;
}





// ====================== API FEACTHING =======================

// get course
export async function fetchCourse(id: string): Promise<coursesResponse> {
    const {data} = await api.get(`/viewcourse/${id}`)
    return data
}





// ====================== QUREY CREATE =======================

// get course
export const useCourse = (id: string) => {
    return useQuery({
        queryKey: ['courseview', {id}],
        queryFn: () => fetchCourse(id),
        staleTime: 5 * 60 * 1000,
    })
}