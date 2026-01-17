import { create } from "zustand";

export interface SelectedFileItem {
  name: string;
  file: File | null; // null for existing files from server
  preview: string;
  isExisting?: boolean; // Track if file is from database
}

interface CourseStore {
  selectedFiles: Record<string, SelectedFileItem>;
  
  addFile: (item: SelectedFileItem) => void;
  removeFile: (name: string) => void;
  getFile: (name: string) => SelectedFileItem | null;
  reset: () => void;
  initializeFromDefaults: (defaults: Record<string, string>) => void; // New method
}

export const useCoursesStore = create<CourseStore>((set, get) => ({
  selectedFiles: {},

  addFile: (item) =>
    set((state) => ({
      selectedFiles: {
        ...state.selectedFiles,
        [item.name]: item,
      },
    })),

  removeFile: (name) =>
    set((state) => {
      const newFiles = { ...state.selectedFiles };
      delete newFiles[name];
      return { selectedFiles: newFiles };
    }),

  getFile: (name) => {
    return get().selectedFiles[name] || null;
  },

  reset: () => set({ selectedFiles: {} }),

  // Initialize files from defaultValues (edit mode)
  initializeFromDefaults: (defaults) => {
    const existingFiles: Record<string, SelectedFileItem> = {};
    
    Object.entries(defaults).forEach(([key, url]) => {
      if (url && url.trim() !== "") {
        existingFiles[key] = {
          name: key,
          file: null, // No File object for existing files
          preview: url, // URL from database
          isExisting: true,
        };
      }
    });
    
    set({ selectedFiles: existingFiles });
  },
}));
