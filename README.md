# FinFresh — Personal Finance Tracker

FinFresh is a full-stack personal finance management application that helps users track income, expenses, savings, and overall financial health.

The application provides a clean dashboard, financial insights, transaction tracking, and a financial health scoring system.

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication

## Dashboard

* Total Income
* Total Expenses
* Savings Overview
* Savings Rate
* Financial Health Score
* Smart Suggestions

## Transactions

* Add Income & Expense Transactions
* Category Based Tracking
* Monthly Financial Summary

## Financial Health System

Calculates score based on:

* Savings Rate
* Debt Ratio
* Investment Ratio
* Emergency Fund

---

# Tech Stack

## Frontend

* Next.js
* React.js
* Tailwind CSS
* Axios
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

# Project Structure

```bash
finfresh/
│
├── backend/
│
└── frontend/
```

---

# Frontend Setup

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Backend Setup

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# API Endpoints

## Auth Routes

| Method | Endpoint        | Description   |
| ------ | --------------- | ------------- |
| POST   | `/api/register` | Register user |
| POST   | `/api/login`    | Login user    |

---

## Transaction Routes

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| POST   | `/api/transactions`         | Add transaction      |
| GET    | `/api/transactions`         | Get transactions     |
| GET    | `/api/transactions/summary` | Get summary          |
| GET    | `/api/financial-health`     | Get financial health |

---

# Financial Health Logic

The score is calculated using:

* Savings Score
* Debt Score
* Investment Score
* Emergency Fund Score

Final score categories:

* Excellent
* Healthy
* Moderate
* At Risk

---

# UI Features

* Responsive Design
* Reusable Components
* Skeleton Loaders
* Modern Dashboard UI
* Mobile Friendly Navbar

---

# Future Improvements

* Charts & Graphs
* Edit/Delete Transactions
* Monthly Reports
* Dark Mode
* Budget Goals
* AI-Based Suggestions

---


