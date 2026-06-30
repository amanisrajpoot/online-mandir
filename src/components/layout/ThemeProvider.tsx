"use client"

import * as React from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = "vandanam-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light")
  const [mounted, setMounted] = React.useState(false)

  // On mount, read the theme from localStorage / <html> class
  // The inline script in layout.tsx will have already applied the correct class
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === "dark" || stored === "light") {
      setThemeState(stored)
    } else {
      // If no stored preference, check if the html element has the dark class
      // (set by the inline script based on system preference or default)
      const isDark = document.documentElement.classList.contains("dark")
      setThemeState(isDark ? "dark" : "light")
    }
    setMounted(true)
  }, [])

  const applyTheme = React.useCallback((newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem(STORAGE_KEY, newTheme)
  }, [])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
  }, [applyTheme])

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }, [theme, setTheme])

  // Prevent hydration mismatch — render children immediately but
  // the theme context value won't be "correct" until after mount.
  // The inline script ensures the visual state is correct from the start.
  const value = React.useMemo(
    () => ({ theme: mounted ? theme : "light", toggleTheme, setTheme }),
    [theme, mounted, toggleTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
