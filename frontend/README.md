# FinFresh Frontend

Frontend for **FinFresh** — a personal finance tracking application built using **Next.js**, **React**, and **Tailwind CSS**.

Users can:

* Register & Login
* Add transactions
* View dashboard summary
* Track income & expenses
* Check financial health score
* Get financial suggestions

---

# Tech Stack

* Next.js
* React.js
* Tailwind CSS
* Axios
* React Hot Toast

---

# Features

## Authentication

* User Registration
* User Login
* JWT Token Storage

## Dashboard

* Total Income
* Total Expenses
* Savings
* Savings Rate
* Financial Health Score
* Suggestions Section
* Categories Breakdown

## Transactions

* Add Transaction
* Income & Expense Tracking
* Category Based Tracking

## UI Features

* Responsive Design
* Reusable Components
* Skeleton Loaders
* Clean Dashboard UI

---

# Folder Structure

```bash
src/
│
├── components/
│   ├── common/
│   └── loaders/
│
├── pages/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   └── transaction/
│
├── styles/
│
└── utils/
```

---

# Installation

Clone the repository:

```bash
git clone <frontend-repo-url>
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:3000
```

---

# Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# API Integration

Axios instance is configured in:

```bash
src/pages/api/Api.js
```

API routes are managed in:

```bash
src/pages/api/ApiRoutes.js
```

---

# Pages

| Page               | Description       |
| ------------------ | ----------------- |
| `/register`        | User registration |
| `/login`           | User login        |
| `/dashboard`       | Finance dashboard |
| `/transaction/add` | Add transaction   |

---

# Components

## Common Components

* Navbar
* Layout

## Loaders

* CardLoader
* ListLoader

---

# Financial Health Calculation

The dashboard calculates:

* Savings Rate
* Expense Ratio
* Debt Ratio
* Investment Ratio

Based on these metrics, a financial health score is generated.

---

# Future Improvements

* Charts & Analytics
* Transaction History
* Edit/Delete Transactions
* Dark Mode
* Pagination
* Export Reports
* Better Authentication Handling

---


