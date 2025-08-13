import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock data - In production, use a real database
let transactions = [
  {
    id: "1",
    userId: "1",
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2024-01-15",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    userId: "1",
    type: "expense",
    amount: 1200,
    category: "Rent",
    description: "Monthly rent payment",
    date: "2024-01-01",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    userId: "1",
    type: "expense",
    amount: 300,
    category: "Food",
    description: "Groceries",
    date: "2024-01-10",
    createdAt: new Date().toISOString()
  }
]

function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userTransactions = transactions.filter(t => t.userId === user.userId)
  return NextResponse.json(userTransactions)
}

export async function POST(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { type, amount, category, description, date } = await request.json()

    const newTransaction = {
      id: Date.now().toString(),
      userId: user.userId,
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      createdAt: new Date().toISOString()
    }

    transactions.push(newTransaction)

    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const transactionIndex = transactions.findIndex(
      t => t.id === id && t.userId === user.userId
    )

    if (transactionIndex === -1) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    transactions.splice(transactionIndex, 1)

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
