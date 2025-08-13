const express = require("express")
const { body, validationResult } = require("express-validator")
const Category = require("../models/Category")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all categories for user
router.get("/", auth, async (req, res) => {
  try {
    const { type } = req.query
    const filter = { user: req.user._id }

    if (type) {
      filter.type = type
    }

    const categories = await Category.find(filter).sort({ name: 1 })
    res.json(categories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new category
router.post(
  "/",
  [
    auth,
    body("name").trim().isLength({ min: 1 }).withMessage("Category name is required"),
    body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("color").optional().isHexColor().withMessage("Color must be a valid hex color"),
    body("icon").optional().isString().withMessage("Icon must be a string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, type, color, icon } = req.body

      // Check if category already exists
      const existingCategory = await Category.findOne({
        user: req.user._id,
        name: name.toLowerCase(),
        type,
      })

      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" })
      }

      const category = new Category({
        user: req.user._id,
        name,
        type,
        color: color || "#3b82f6",
        icon: icon || "DollarSign",
      })

      await category.save()
      res.status(201).json(category)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update category
router.put(
  "/:id",
  [
    auth,
    body("name").optional().trim().isLength({ min: 1 }).withMessage("Category name is required"),
    body("color").optional().isHexColor().withMessage("Color must be a valid hex color"),
    body("icon").optional().isString().withMessage("Icon must be a string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const category = await Category.findOne({
        _id: req.params.id,
        user: req.user._id,
      })

      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }

      const updates = req.body
      Object.keys(updates).forEach((key) => {
        category[key] = updates[key]
      })

      await category.save()
      res.json(category)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete category
router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
