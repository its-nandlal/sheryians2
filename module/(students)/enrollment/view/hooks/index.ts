import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// ✅ Interface for API Response
interface EnrollmentCourseResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    language: string;
    type: string;
    status: string;
    price: number;
    discountedPrice?: number | null;
    thumbnailUrl?: string | null;
    startTime: string;
    duration: string;
    level: string;
    modules: Array<{
      id: string;
      title: string;
      order: number;
      type: string;
      duration?: string | null;
      chapter: Array<{
        id: string;
        title: string;
        videoUrl?: string | null;
        duration?: string | null;
        createdAt: string;
      }>;
    }>;
    enrollments: Array<{
      id: string;
      progress: number;
      completed: boolean;
      enrolledAt: string;
    }>;
    instructors: Array<{
      instructor: {
        id: string;
        name: string;
        avatarUrl?: string | null;
      };
    }>;
  };
  error?: string;
}

async function fetchEnrollmentCourse(id: string): Promise<EnrollmentCourseResponse> {
  const { data } = await api.get(`/enrollment/${id}`);
  return data;
}

export const useViewEnrollmentCourse = (id: string) => {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: () => fetchEnrollmentCourse(id),
    staleTime: 5 * 60 * 1000,
  });
};
