"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme || "light"
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.documentElement.setAttribute("data-theme", theme)

    // Update CSS variables based on theme
    if (theme === "dark") {
      document.documentElement.style.setProperty("--bg-primary", "#1e293b")
      document.documentElement.style.setProperty("--bg-secondary", "#334155")
      document.documentElement.style.setProperty("--text-primary", "#f8fafc")
      document.documentElement.style.setProperty("--text-secondary", "#cbd5e1")
      document.documentElement.style.setProperty("--border-color", "#475569")
    } else {
      document.documentElement.style.setProperty("--bg-primary", "#ffffff")
      document.documentElement.style.setProperty("--bg-secondary", "#f8fafc")
      document.documentElement.style.setProperty("--text-primary", "#1e293b")
      document.documentElement.style.setProperty("--text-secondary", "#64748b")
      document.documentElement.style.setProperty("--border-color", "#e2e8f0")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
