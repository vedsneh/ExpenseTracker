"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { LayoutDashboard, TrendingUp, TrendingDown, LogOut, Menu, X, DollarSign, User, Tag, Repeat } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Income",
      href: "/income",
      icon: TrendingUp,
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: TrendingDown,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: Tag,
    },
    {
      name: "Recurring",
      href: "/recurring",
      icon: Repeat,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Mobile menu button */}
      <div className="lg:hidden" style={{ position: "fixed", top: "1rem", left: "1rem", zIndex: 50 }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-secondary"
          style={{ padding: "0.5rem" }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          inset: "0 auto 0 0",
          zIndex: 40,
          width: "16rem",
          backgroundColor: "white",
          borderRight: "1px solid #e2e8f0",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
        }}
        className="lg:translate-x-0 lg:static lg:inset-0"
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "4rem",
              padding: "0 1rem",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <DollarSign size={32} style={{ color: "#3b82f6" }} />
              <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1e293b" }}>ExpenseTracker</span>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    transition: "colors 0.2s",
                    backgroundColor: isActive ? "#dbeafe" : "transparent",
                    color: isActive ? "#1d4ed8" : "#374151",
                    gap: "0.75rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "#f1f5f9"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "transparent"
                    }
                  }}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div style={{ padding: "1rem", borderTop: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", gap: "0.75rem" }}>
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  backgroundColor: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#1e293b" }}>{user?.name}</p>
                <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "flex-start" }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="lg:ml-0">
        {/* Header */}
        <header
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #e2e8f0",
            padding: "1rem 1.5rem",
            marginLeft: "4rem",
          }}
          className="lg:ml-0"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b" }}>
                  Welcome back, {user?.name}!
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Here's your financial overview</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>{children}</main>
      </div>
    </div>
  )
}

export default Layout
