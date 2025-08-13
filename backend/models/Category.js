const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
    icon: {
      type: String,
      default: "DollarSign",
    },
  },
  {
    timestamps: true,
  },
)

// Ensure unique category names per user and type
categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true })

module.exports = mongoose.model("Category", categorySchema)
