

export type CourseResponse = {
    success: boolean;
    data?: {
        id: string;
        slug: string;
        title: string;
        price: number;
        discountedPrice?: number | null;
    }

    error?: string;
    status: number;
}