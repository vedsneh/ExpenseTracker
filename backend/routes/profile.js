const express = require("express")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Get user profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put(
  "/",
  [
    auth,
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").optional().isEmail().withMessage("Please enter a valid email"),
    body("budget").optional().isNumeric().isFloat({ min: 0 }).withMessage("Budget must be a positive number"),
    body("theme").optional().isIn(["light", "dark"]).withMessage("Theme must be light or dark"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, budget, theme, profilePicture } = req.body
      const user = await User.findById(req.user._id)

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" })
        }
      }

      // Update fields
      if (name) user.name = name
      if (email) user.email = email
      if (budget !== undefined) user.budget = Number.parseFloat(budget)
      if (theme) user.theme = theme
      if (profilePicture) user.profilePicture = profilePicture

      await user.save()

      // Return user without password
      const updatedUser = await User.findById(user._id).select("-password")
      res.json(updatedUser)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Change password
router.put(
  "/password",
  [
    auth,
    body("currentPassword").exists().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { currentPassword, newPassword } = req.body
      const user = await User.findById(req.user._id)

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Check current password
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      // Update password
      user.password = newPassword
      await user.save()

      res.json({ message: "Password updated successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

module.exports = router
