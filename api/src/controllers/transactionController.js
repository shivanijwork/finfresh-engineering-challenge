import Transaction from "../models/Transaction.js";
import catchAsync from "../utils/catchAsync.js";
import { successResponse, errorResponse } from "../utils/errorHandling.js";
import calculateFinancialHealth from "../utils/financialScore.js";


export const createTransaction = catchAsync(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    // Validation
    if (!type || !category || !amount || !date) {
        return errorResponse(
            res,
            "All required fields must be provided",
            400
        );
    }

    // Validate amount
    if (amount <= 0) {
        return errorResponse(
            res,
            "Amount must be greater than 0",
            400
        );
    }

    // Allowed transaction types
    const allowedTypes = [
        "income",
        "expense",
        "investment",
        "debt",
    ];

    if (!allowedTypes.includes(type)) {
        return errorResponse(
            res,
            "Invalid transaction type",
            400
        );
    }

    // Create transaction
    const transaction =
        await Transaction.create({
            userId: req.user.id,
            type,
            category,
            amount,
            date,
            description,
        });

    return successResponse(
        res,
        "Transaction created successfully",
        201,
        transaction
    );
}
);


export const getTransactions = catchAsync(async (req, res) => {
    // Query params
    const page = Number(req.query.page) || 1;

    const limit =
        Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const { type, category } = req.query;

    // Filter object
    const filters = {
        userId: req.user.id,
    };

    // Optional filters
    if (type) {
        filters.type = type;
    }

    if (category) {
        filters.category = category;
    }

    // Fetch transactions
    const transactions =
        await Transaction.find(filters)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

    // Total count
    const total =
        await Transaction.countDocuments(
            filters
        );

    return successResponse(
        res,
        "Transactions fetched successfully",
        200,
        {
            data: transactions,
            pagination: {
                page,
                limit,
                total,
            },
        }
    );
}
);

export const getSummary = catchAsync(async (req, res) => {
    const userId = req.user.id;

    // Current month start & end
    const now = new Date();

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
    );

    // Fetch current month transactions
    const transactions =
        await Transaction.find({
            userId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        });

    let income = 0;
    let expense = 0;

    const categories = {};

    // Calculate totals
    transactions.forEach((transaction) => {
        const amount = Math.max(
            transaction.amount,
            0
        );

        // Income
        if (transaction.type === "income") {
            income += amount;
        }

        // Expense
        if (transaction.type === "expense") {
            expense += amount;
        }

        // Categories breakdown
        if (categories[transaction.category]) {
            categories[transaction.category] += amount;
        } else {
            categories[transaction.category] = amount;
        }
    });

    // Savings
    const savings = income - expense;

    // Savings rate
    const savingsRate = income > 0 ? Number(
        (
            (savings / income) *
            100
        ).toFixed(1)
    )
        : 0;


    return successResponse(
        res,
        "Summary fetched successfully",
        200,
        {
            income,
            expense,
            savings,
            savingsRate,
            categories,
        }
    );
}
);

export const getFinancialHealth = catchAsync(async (req, res) => {
    const userId = req.user.id;
    console.log("User ID:", userId);
    const transactions = await Transaction.find({ userId });
    console.log("Transactions:", transactions);
    const result = calculateFinancialHealth(transactions);

    return successResponse(
        res,
        "Financial health calculated successfully",
        200,
        result
    );
});