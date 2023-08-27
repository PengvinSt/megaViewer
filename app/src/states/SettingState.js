import { create } from 'zustand'


export const useSettingsStore = create((set) => ({
    innerSetting: {},
    setInnerSetting: (innerSetting) => set({ innerSetting }),
}))