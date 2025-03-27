// Theme types
export type Theme = 'light' | 'dark'
export type ThemeMode = 'light' | 'dark' | 'system'

// Constants
const THEME_STORAGE_KEY = 'themeMode'
const THEME_DATA_ATTRIBUTE = 'data-theme'
const DEFAULT_THEME: Theme = 'light'
const DEFAULT_THEME_MODE: ThemeMode = 'system'

// Theme management functions
export const setThemeMode = (mode: ThemeMode): void => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    document.documentElement.setAttribute(THEME_DATA_ATTRIBUTE, mode)
}

export const getSystemTheme = (): Theme => {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light'
}

export const getTheme = (): Theme => {
    const mode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode
    
    switch (mode) {
        case 'light':
        case 'dark':
            return mode
        case 'system':
        case null:
            return getSystemTheme()
        default:
            return DEFAULT_THEME
    }
}

export const getThemeMode = (): ThemeMode => {
    const mode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode
    return (mode === 'light' || mode === 'dark' || mode === 'system') 
        ? mode 
        : DEFAULT_THEME_MODE
}

export const setTheme = (themeMode: ThemeMode): Theme => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode)
    return getTheme()
}

export const listenToThemeChanges = (callback: (theme: Theme) => void): () => void => {
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = () => callback(getTheme())

    systemThemeQuery.addEventListener('change', handleThemeChange)
    window.addEventListener('storage', handleThemeChange)

    return () => {
        systemThemeQuery.removeEventListener('change', handleThemeChange)
        window.removeEventListener('storage', handleThemeChange)
    }
}

// Theme context type and initial value
export type ThemeContext = {
    theme: Theme
}

export const themeContext: ThemeContext = {
    theme: getTheme()
}
