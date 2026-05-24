📘 FinFresh Backend API

A financial tracking and intelligence backend system built using Node.js, Express, and MongoDB, featuring transaction management, authentication, and a real-time financial health scoring engine.

🚀 Tech Stack
Node.js (ES Modules)
Express.js
MongoDB + Mongoose
JWT Authentication
bcrypt
Nodemon (development)
📁 Project Structure
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── utils/
 │    ├── financialHealthScore.js
 │    ├── catchAsync.js
 │    └── errorHandling.js
 ├── app.js
 └── server.js
⚙️ Environment Variables

Create a .env file in root:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
🌐 Base URL

All API endpoints are prefixed with:

/api
🔐 Authentication

All protected routes require:

Authorization: Bearer <token>
JWT is used for authentication
userId is extracted from token (never from request body)
📌 API Endpoints
🔐 Auth
Register
POST /api/auth/register

Request

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

Response

{
  "token": "<jwt_token>",
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
Login
POST /api/auth/login
💰 Transactions
Create Transaction
POST /api/transactions

Request

{
  "type": "expense",
  "category": "Food",
  "amount": 1200,
  "date": "2026-01-10",
  "description": "Lunch with team"
}
Allowed Types
income
expense
investment
debt
Get Transactions
GET /api/transactions?page=1&limit=20&type=expense&category=Food
📊 Summary
Monthly Financial Summary
GET /api/summary

Response

{
  "income": 80000,
  "expense": 52000,
  "savings": 28000,
  "savingsRate": 35.0,
  "categories": {
    "Food": 12000,
    "Rent": 20000,
    "Transport": 5000
  }
}
💡 Financial Health Score (CORE FEATURE)
Get Financial Health
GET /api/financial-health
Response
{
  "score": 80,
  "category": "Excellent",
  "breakdown": {
    "emergencyFund": 25,
    "savingsRate": 25,
    "debtRatio": 25,
    "investmentRatio": 5
  },
  "ratios": {
    "savingsRate": 95.5,
    "expenseRate": 0.04,
    "debtRatio": 0,
    "investmentRatio": 0
  },
  "suggestions": [
    "Start investing at least 10% of your income"
  ]
}
📊 Score Categories
Score Range	Category
80–100	Excellent
60–79	Healthy
40–59	Moderate
< 40	At Risk
🧠 Scoring System

Score is calculated based on 4 components:

Emergency Fund (25)
Savings Rate (25)
Debt Ratio (25)
Investment Ratio (25)

Each component is derived from user transaction history.

🗄️ Database Schema
Users
name: String
email: String (unique)
passwordHash: String
createdAt: Date
Transactions
userId: ObjectId
type: "income" | "expense" | "investment" | "debt"
category: String
amount: Number
date: Date
description: String
createdAt: Date
🧠 Design Decisions
JWT authentication for stateless security
MongoDB for flexible financial data structure
Dynamic computation of financial health score
Modular utility-based architecture
API-first design for frontend integration
