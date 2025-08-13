"use client"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      style={{
        padding: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ThemeToggle
