import { create } from 'zustand'

export interface Settings {
  pandocPath: string
  defaultOutputPath: string
  autoOpenOutput: boolean
  showAdvancedParams: boolean
  theme: string
}

interface SettingsStore {
  settings: Settings
  loadSettings: () => void
  saveSettings: (settings: Settings) => void
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS: Settings = {
  pandocPath: '',
  defaultOutputPath: '',
  autoOpenOutput: true,
  showAdvancedParams: false,
  theme: 'light'
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: () => {
    try {
      const saved = localStorage.getItem('panview-settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        set({ settings: { ...DEFAULT_SETTINGS, ...parsed } })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem('panview-settings', JSON.stringify(settings))
      set({ settings })
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  },

  updateSetting: (key, value) => {
    const { settings } = get()
    const newSettings = { ...settings, [key]: value }
    set({ settings: newSettings })
    localStorage.setItem('panview-settings', JSON.stringify(newSettings))
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS })
    localStorage.setItem('panview-settings', JSON.stringify(DEFAULT_SETTINGS))
  }
}))
