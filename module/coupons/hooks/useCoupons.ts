




// ====================== TYPES & INTERFACE =======================

import { api } from "@/lib/axios"
import { PaginationParams } from "@/module/instructor/hooks/useInstructors"
import { coupon } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export interface getCouponsProps {
    success: boolean,
    message: string,
    data: coupon[],
    total: number,
    totalPages: number,
    currentPage: number,
    limit: number,
    error: string
}







// ====================== API FEACTHING =======================

// get api
async function fetchCoupons(
    {page, limit, search}: PaginationParams
): Promise<getCouponsProps> {
    const { data } = await api.get("/coupons", {params: {page, limit, search} })

    return data;
}

// create api
async function fetchCreateCoupon(formData: FormData) {
    const { data } = await api.post("/coupons", formData)
    return data;
}

// update api
async function fetchUpdateCoupon(id: string, formData: FormData) {
    const { data } = await api.patch(`/coupons/${id}`, formData)
    return data;
}

// delete api
async function fetchDeleteCoupon(id: string) {
    const { data } = await api.delete(`/coupons/${id}`)
    return data;
}









// ====================== QUERY CREATE =======================

// get coupons
export const useCoupons = ({page, limit, search}: PaginationParams) => {
    return useQuery({
        queryKey: ['coupons', {page, limit, search}],
        queryFn: () => fetchCoupons({page, limit, search}),
        staleTime: 5 * 60 * 1000,
    })
}

// create coupon
export const useCreateCoupon = () => {
    const qureyKey = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchCreateCoupon(formData),
        onSuccess: ( data ) => {
            if(data.success) {
                qureyKey.invalidateQueries({ queryKey: ['coupons']})
                toast.success(data.message || "Coupon created successfully")
            } else {
                toast.error(data.error || "Creating failed")
            }
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Something went wrong while creating coupon.")
        }
    })
}

// update coupon
export const useUpdateCoupon = (id: string) => {
    const qureyKey = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => fetchUpdateCoupon(id, formData),
        onSuccess: ( data ) => {
            if(data.success) {
                qureyKey.invalidateQueries({ queryKey: ['coupons']})
                toast.success(data.message || "Coupon updated successfully")
            } else {
                toast.error(data.error || "Updating failed")
            }
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Something went wrong while updating coupon.")
        }
    })
}

// delete coupon
export const useDeleteCoupon = () => {
    const qureyKey = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => fetchDeleteCoupon(id),
        onSuccess: ( data ) => {
            if(data.success) {
                qureyKey.invalidateQueries({ queryKey: ['coupons']})
                toast.success(data.message || "Coupon deleted successfully")
            } else {
                toast.error(data.error || "Deleting failed")
            }
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Something went wrong while deleting coupon.")
        }
    })
}