import { api } from "@/lib/axios";
import { PaginationParams } from "@/module/instructor/hooks/useInstructors";
import { ApiError } from "@/types";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";


// ====================== TYPES & INTERFACE =======================

export interface getStudentsProps {
    success: boolean,
    message: string,
    data: User[],
    total: number,
    totalPages: number,
    currentPage: number,
    limit: number,
    graphData: User[]
    error: string
}

export type getStudentsResponse = getStudentsProps | ApiError








// ====================== API FEACTHING =======================



// get api
async function fetchStudents(
    {page, limit, search}: PaginationParams
): Promise<getStudentsProps> {
    const { data } = await api.get("/students", 
    {params: {page, limit, search} })

    return data;
}








// ====================== Qureys CREATE =======================

// get students
export const useStudents = ({page, limit, search}:PaginationParams) => {
    return useQuery({
        queryKey: ["students", {page, limit, search}],
        queryFn: () => fetchStudents({page, limit, search}),
        staleTime: 5 * 60 * 1000,
    })
}