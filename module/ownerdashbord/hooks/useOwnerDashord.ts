import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";



interface OwnerDashbordProps {
    success: boolean,
    error: string,
    data: {
        courses: {
            id: string,
            title: string,
            price: number,
            createdAt: Date,
            thumbnailUrl: string,
            bannerUrl: string
        }[],
        students: {
            id: string,
            name: string,
            createdAt: Date,
        }[]
    }
}


async function fetchOwnerDashord(): Promise<OwnerDashbordProps> {
    const { data } = await api.get("/ownerdashbord");
    return data;
}



export const useOwnerDashord = () => {
    return useQuery({
        queryKey: ["ownerDashbord"],
        queryFn: () => fetchOwnerDashord(),
        staleTime: 5 * 60 * 1000,
    })
}