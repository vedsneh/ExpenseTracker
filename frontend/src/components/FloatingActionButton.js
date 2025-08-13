"use client"

import { useState } from "react"
import { Plus, X, TrendingUp, TrendingDown, Repeat } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Don't show FAB on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null
  }

  const actions = [
    {
      icon: TrendingUp,
      label: "Add Income",
      color: "#10b981",
      onClick: () => {
        navigate("/income")
        setIsOpen(false)
      },
    },
    {
      icon: TrendingDown,
      label: "Add Expense",
      color: "#ef4444",
      onClick: () => {
        navigate("/expenses")
        setIsOpen(false)
      },
    },
    {
      icon: Repeat,
      label: "Recurring",
      color: "#8b5cf6",
      onClick: () => {
        navigate("/recurring")
        setIsOpen(false)
      },
    },
  ]

  return (
    <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000 }}>
      {/* Action buttons */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "70px",
            right: "0",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            alignItems: "flex-end",
          }}
        >
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  animation: `slideUp 0.3s ease ${index * 0.1}s both`,
                }}
              >
                <span
                  style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    boxShadow: "var(--shadow)",
                    border: "1px solid var(--border-color)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {action.label}
                </span>
                <button
                  onClick={action.onClick}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: action.color,
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "var(--shadow-lg)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"
                  }}
                >
                  <Icon size={20} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        className="fab"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default FloatingActionButton
