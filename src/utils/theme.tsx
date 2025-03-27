// Theme types
export type Theme = 'light' | 'dark'
export type ThemeMode = 'light' | 'dark' | 'system'

// Constants
const THEME_STORAGE_KEY = 'themeMode'
const DEFAULT_THEME: Theme = 'light'
const DEFAULT_THEME_MODE: ThemeMode = 'system'

// Theme management functions
export const setTheme = (theme: Theme): void => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
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

export const setThemeMode = (themeMode: ThemeMode): Theme => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode)
    return getTheme()
}


export const listenToThemeChanges = (callback: () => void): () => void => {
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = () => callback()

    systemThemeQuery.addEventListener('change', handleThemeChange)
    window.addEventListener('storage', handleThemeChange)

    return () => {
        systemThemeQuery.removeEventListener('change', handleThemeChange)
        window.removeEventListener('storage', handleThemeChange)
    }
}

export const setInitialTheme = (): void => {
    const theme = getTheme()

    setTheme(theme)
}

// Theme context type and initial value
export type ThemeContext = {
    theme: Theme
    setTheme: (mode: ThemeMode) => void
    getThemeMode: () => ThemeMode
    listenToThemeChanges: () => () => void

}

export const themeContext: ThemeContext = {
    theme: getTheme(),
    setTheme: (mode: ThemeMode) => {
        console.log('Setting theme to:', mode)
        setThemeMode(mode)
        themeContext.theme = getTheme()
        console.log('Theme set to:', themeContext.theme)
        setTheme(themeContext.theme)
        console.log('Theme applied:', themeContext.theme)
    },
    getThemeMode: () => {
        const mode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode
        return (mode === 'light' || mode === 'dark' || mode === 'system') 
            ? mode 
            : DEFAULT_THEME_MODE
    },
    listenToThemeChanges: () => {
        const handleThemeUpdate = () => {
            console.log('Theme updated')
            themeContext.theme = getTheme()
            setTheme(themeContext.theme)
            console.log('Theme set to:', themeContext.theme)
        }
        return listenToThemeChanges(handleThemeUpdate)
    },
}
