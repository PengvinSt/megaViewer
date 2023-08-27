import { create } from 'zustand'


export const usePathStore = create((set) => ({
    path: '',
    currentPath: '',
    setPath: (path) => set({ path }),
    setCurrentPath: (path) => set({ currentPath:path }),
}))