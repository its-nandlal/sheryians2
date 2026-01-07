import { create } from "zustand"

interface InstructorState {
    page: number;
    search: string;

    setPage: (page: number) => void;
    setSearch: (search: string) => void;

    rest: () => void;
}


export const useInstructorsStore = create<InstructorState>((set)=>({
    page: 1,
    search: '',

    setPage: (page)=> set({page}),
    setSearch: (search) => set({search, page: 1}),
    rest: () => set({page: 1, search: ''})

}))