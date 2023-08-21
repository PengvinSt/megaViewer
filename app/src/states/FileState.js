import { create } from 'zustand'


export const usePathStore = create((set) => ({
    path: '',
    setPath: (path) => set({ path }),
}))