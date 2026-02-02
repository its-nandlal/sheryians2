import { api } from "@/lib/axios";
import { Course, Enrollment } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";


interface EnrollmentProps {
    success: boolean;
    data?: {
        enrollments: Enrollment[],
        course: Course[]
    },
    error?: string
}


export async function fetchEnrollments (): Promise<EnrollmentProps> {
    const { data } = await api.get("/enrollment")
    return data
}




export const useEnrollments = () => {
    return useQuery({
        queryKey: ["enrollments"],
        queryFn: fetchEnrollments,
        staleTime: 5 * 60 * 1000
    })
}