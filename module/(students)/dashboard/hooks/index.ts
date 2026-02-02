// hooks/useDashboard.ts
import { api } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useQuery as useSuspenseQuery } from "@tanstack/react-query";

// ✅ Full TypeScript Interface (matches API)
export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  recentCourses: Array<{
    id: string;
    title: string;
    thumbnailUrl?: string;
    level: string;
    price: number;
    discountedPrice?: number;
  }>;
  enrollments: Array<{
    id: string;
    progress: number;
    enrolledAt: string;
    course: {
      id: string;
      title: string;
      thumbnailUrl?: string;
      status: string;
    };
  }>;
  stats: {
    totalEnrollments: number;
    totalCourses: number;
    pendingPayments: number;
  };
  recommendations: Array<{
    id: string;
    title: string;
    level: string;
    price: number;
    thumbnailUrl?: string;
  }>;
  coupons: Array<{
    id: string;
    code: string;
    discountValue: number;
    expiresAt: string;
  }>;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  error?: string;
}

// ✅ 1. Standard useQuery (with loading/error states)
export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,  // 10 minutes
    retry: 1,
  });
}

// ✅ 2. Suspense useQuery (for App Router streaming)
export function useSuspenseDashboard() {
  return useSuspenseQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ✅ 3. Prefetch Hook (for better UX)
export function usePrefetchDashboard() {
  const queryClient = useQueryClient();
  
  return {
    prefetch: () => {
      queryClient.prefetchQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
          const { data } = await api.get("/dashboard");
          return data;
        },
      });
    }
  };
}
