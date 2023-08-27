import { create } from 'zustand'


export const useContextStore = create((set) => ({
    contextData: {},
    setContextData: (contextData) => set({ contextData }),
}))