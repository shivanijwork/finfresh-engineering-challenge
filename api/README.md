# FinFresh Backend API

A scalable financial tracking backend built using Node.js, Express, and MongoDB.  
The API supports authentication, transaction management, monthly summaries, and a real-time financial health scoring engine.

---

# 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Nodemon

---

# 📁 Project Structure

```bash
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
│   ├── financialScore.js
│   ├── catchAsync.js
│   └── errorHandling.js
├── app.js
└── server.js
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

---

# 📦 Installation

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Server runs on:

```bash
http://localhost:5000
```

---

# 🌐 Base API URL

All endpoints are prefixed with:

```bash
/api
```

---

# 🔐 Authentication

Protected routes require JWT authentication.

Add token in headers:

```bash
Authorization: Bearer <token>
```

JWT is used for:
- User authentication
- Protected route access
- Extracting `userId`

---

# 📌 API Endpoints

---

## 🔐 Auth Routes

### Register User

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Login User

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

# 💰 Transaction Routes

### Create Transaction

```http
POST /api/transactions
```

### Request Body

```json
{
  "type": "expense",
  "category": "Food",
  "amount": 1200,
  "date": "2026-01-10",
  "description": "Lunch with team"
}
```

---

## ✅ Allowed Transaction Types

- income
- expense
- investment
- debt

---

### Get Transactions

```http
GET /api/transactions?page=1&limit=20&type=expense&category=Food
```

Supports:
- Pagination
- Type filtering
- Category filtering

---

# 📊 Monthly Summary

### Get Monthly Summary

```http
GET /api/summary
```

### Response

```json
{
  "income": 80000,
  "expense": 52000,
  "savings": 28000,
  "savingsRate": 35,
  "categories": {
    "Food": 12000,
    "Rent": 20000,
    "Transport": 5000
  }
}
```

---

# 💡 Financial Health Score

Core intelligent scoring feature based on user financial behavior.

### Get Financial Health

```http
GET /api/financial-health
```

### Response

```json
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
```

---

# 📈 Score Categories

| Score Range | Category |
|-------------|-----------|
| 80 - 100 | Excellent |
| 60 - 79 | Healthy |
| 40 - 59 | Moderate |
| Below 40 | At Risk |

---

# 🧠 Scoring System

Financial health score is calculated using 4 components:

| Component | Weight |
|-----------|---------|
| Emergency Fund | 25 |
| Savings Rate | 25 |
| Debt Ratio | 25 |
| Investment Ratio | 25 |

Each score is dynamically generated from transaction history.

---

# 🗄️ Database Schema

---

## User Schema

```js
{
  name: String,
  email: String,
  passwordHash: String,
  createdAt: Date
}
```

---

## Transaction Schema

```js
{
  userId: ObjectId,
  type: "income" | "expense" | "investment" | "debt",
  category: String,
  amount: Number,
  date: Date,
  description: String,
  createdAt: Date
}
```

---

# 🧠 Design Decisions

- JWT-based stateless authentication
- MongoDB for flexible financial data
- Utility-based modular architecture
- Centralized error handling
- Financial score computed dynamically
- API-first design for frontend integration

---

