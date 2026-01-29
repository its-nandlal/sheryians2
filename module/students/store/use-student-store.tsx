import { create } from "zustand";

interface User {
  id: string;
  role: "STUDENT" | "OWNER";
  createdAt: Date | string;
}

interface UsersState {
  users: User[];
  setUsers: (users: User[]) => void;
  resetUsers: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [], // ✅ default demo data
  setUsers: (users) => set({ users }),
  resetUsers: () => set({ users: [] }),
}));
