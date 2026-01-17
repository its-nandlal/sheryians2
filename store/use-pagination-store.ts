import { create } from "zustand"

interface PaginationState {
    page: number;
    search: string;

    setPage: (page: number) => void;
    setSearch: (search: string) => void;

    reset: () => void;
}


export const usePaginationStore = create<PaginationState>((set)=>({
    page: 1,
    search: '',

    setPage: (page)=> set({page}),
    setSearch: (search) => set({search, page: 1}),
    reset: () => set({page: 1, search: ''})

}))