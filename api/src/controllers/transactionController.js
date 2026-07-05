import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
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

    const { type, category, startDate, endDate } = req.query;

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

    if (startDate || endDate) {
        filters.date = {};

        if (startDate) {
            const parsedStart = new Date(startDate);
            if (!isNaN(parsedStart)) {
                parsedStart.setHours(0, 0, 0, 0);
                filters.date.$gte = parsedStart;
            }
        }

        if (endDate) {
            const parsedEnd = new Date(endDate);
            if (!isNaN(parsedEnd)) {
                parsedEnd.setHours(23, 59, 59, 999);
                filters.date.$lte = parsedEnd;
            }
        }

        if (Object.keys(filters.date).length === 0) {
            delete filters.date;
        }
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

export const updateTransaction = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { type, category, amount, date, description } = req.body;

    if (!type || !category || !amount || !date) {
        return errorResponse(
            res,
            "All required fields must be provided",
            400
        );
    }

    if (amount <= 0) {
        return errorResponse(
            res,
            "Amount must be greater than 0",
            400
        );
    }

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

    const transaction = await Transaction.findOne({
        _id: id,
        userId: req.user.id,
    });

    if (!transaction) {
        return errorResponse(
            res,
            "Transaction not found",
            404
        );
    }

    transaction.type = type;
    transaction.category = category;
    transaction.amount = amount;
    transaction.date = date;
    transaction.description = description;

    await transaction.save();

    return successResponse(
        res,
        "Transaction updated successfully",
        200,
        transaction
    );
}
);

export const deleteTransaction = catchAsync(async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
        _id: id,
        userId: req.user.id,
    });

    if (!transaction) {
        return errorResponse(
            res,
            "Transaction not found",
            404
        );
    }

    await transaction.deleteOne();

    return successResponse(
        res,
        "Transaction deleted successfully",
        200,
        { id }
    );
}
);

const getCyclePeriod = (referenceDate, cycleStartDay) => {
    const date = new Date(referenceDate);
    date.setHours(0, 0, 0, 0);

    let startYear = date.getFullYear();
    let startMonth = date.getMonth();
    const day = date.getDate();

    if (day < cycleStartDay) {
        startMonth -= 1;
        if (startMonth < 0) {
            startMonth = 11;
            startYear -= 1;
        }
    }

    const start = new Date(startYear, startMonth, cycleStartDay, 0, 0, 0, 0);
    const nextMonth = startMonth === 11 ? 0 : startMonth + 1;
    const nextYear = startMonth === 11 ? startYear + 1 : startYear;
    const end = new Date(nextYear, nextMonth, cycleStartDay, 0, 0, 0, 0);
    end.setMilliseconds(-1);

    return { start, end };
};

const getCyclePeriods = (cycleStartDay, count, referenceDate = new Date()) => {
    const periods = [];
    let { start, end } = getCyclePeriod(referenceDate, cycleStartDay);

    for (let i = 0; i < count; i += 1) {
        const labelStart = new Date(start);
        const labelEnd = new Date(end);

        periods.push({
            label: `${labelStart.toLocaleDateString("default", { month: "short", day: "numeric" })} – ${labelEnd.toLocaleDateString("default", { month: "short", day: "numeric" })}`,
            start: new Date(start),
            end: new Date(end),
        });

        const previousEnd = new Date(start);
        previousEnd.setMilliseconds(-1);
        const previousStartYear = previousEnd.getMonth() === 0 ? previousEnd.getFullYear() - 1 : previousEnd.getFullYear();
        const previousStartMonth = previousEnd.getMonth() === 0 ? 11 : previousEnd.getMonth() - 1;
        start = new Date(previousStartYear, previousStartMonth, cycleStartDay, 0, 0, 0, 0);
        end = new Date(previousEnd);
    }

    return periods.reverse();
};

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

    // Debt
    let debt = 0;
    transactions.forEach((transaction) => {
        if (transaction.type === "debt") {
            debt += Math.max(transaction.amount, 0);
        }
    });

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
            debt,
            categories,
        }
    );
}
);

export const getBudgetHistory = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        return errorResponse(res, "User not found", 404);
    }

    const cycleStartDay = user.budgetGoals?.cycleStartDay || 1;
    const periods = getCyclePeriods(cycleStartDay, 4);
    const history = [];

    for (const period of periods) {
        const transactions = await Transaction.find({
            userId,
            date: {
                $gte: period.start,
                $lte: period.end,
            },
        });

        let income = 0;
        let expense = 0;
        let debt = 0;

        const categories = {};

        transactions.forEach((transaction) => {
            const amount = Math.max(transaction.amount, 0);
            if (transaction.type === "income") {
                income += amount;
            }
            if (transaction.type === "expense") {
                expense += amount;
            }
            if (transaction.type === "debt") {
                debt += amount;
            }
            if (categories[transaction.category]) {
                categories[transaction.category] += amount;
            } else {
                categories[transaction.category] = amount;
            }
        });

        const savings = income - expense;
        history.push({
            label: period.label,
            start: period.start,
            end: period.end,
            income,
            expense,
            savings,
            debt,
            categories,
            monthlyLimit: user.budgetGoals?.monthlyLimit || 0,
        });
    }

    return successResponse(res, "Budget history fetched successfully", 200, history);
});

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

export const getCurrentDayTransactions = catchAsync(async (req, res) => {

    const userId = req.user.id;

    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    const transactions = await Transaction.find({
        userId,
        createdAt: {
            $gte: startTime,
            $lte: endTime,
        },
    });

    return successResponse(
        res,
        "Current day transactions fetched successfully",
        200,
        { data: transactions }
    );
});