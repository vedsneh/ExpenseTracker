"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useTransactions } from "../contexts/TransactionContext"
import axios from "axios"
import toast from "react-hot-toast"
import { User, Mail, Lock, Target, Palette, Save } from "lucide-react"
import ThemeToggle from "../components/ThemeToggle"

const Profile = () => {
  const { user } = useAuth()
  const { fetchMonthlyStats } = useTransactions()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    budget: "",
    theme: "light",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        budget: user.budget || "",
        theme: user.theme || "light",
      })
    }
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put("/api/profile", profileData)
      toast.success("Profile updated successfully!")

      // Refresh monthly stats if budget changed
      if (profileData.budget !== user.budget) {
        fetchMonthlyStats()
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    setPasswordLoading(true)

    try {
      await axios.put("/api/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      toast.success("Password updated successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update password"
      toast.error(message)
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Profile Settings
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-2" style={{ gap: "2rem" }}>
        {/* Profile Information */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <User size={20} />
            Profile Information
          </h3>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} style={{ marginRight: "0.5rem" }} />
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} style={{ marginRight: "0.5rem" }} />
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Target size={16} style={{ marginRight: "0.5rem" }} />
                Monthly Budget
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={profileData.budget}
                onChange={(e) => setProfileData({ ...profileData, budget: e.target.value })}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Set your monthly spending budget to track your expenses
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Palette size={16} style={{ marginRight: "0.5rem" }} />
                Theme Preference
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <select
                  className="form-select"
                  value={profileData.theme}
                  onChange={(e) => setProfileData({ ...profileData, theme: e.target.value })}
                  style={{ flex: 1 }}
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
                <ThemeToggle />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
              {loading ? (
                <>
                  <div className="spinner" style={{ marginRight: "0.5rem" }}></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Lock size={20} />
            Change Password
          </h3>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={passwordLoading} style={{ width: "100%" }}>
              {passwordLoading ? (
                <>
                  <div className="spinner" style={{ marginRight: "0.5rem" }}></div>
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="card" style={{ padding: "1.5rem", marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
          Account Statistics
        </h3>

        <div className="grid md:grid-cols-3" style={{ gap: "1rem" }}>
          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "8px",
            }}
          >
            <p
              style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "0.25rem" }}
            >
              {user?.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Days Active</p>
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "8px",
            }}
          >
            <p
              style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "0.25rem" }}
            >
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Member Since</p>
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "8px",
            }}
          >
            <p
              style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "0.25rem" }}
            >
              ${profileData.budget || 0}
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Monthly Budget</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
