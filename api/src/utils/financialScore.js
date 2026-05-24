const calculateFinancialHealth = (transactions) => {
  let income = 0;
  let expense = 0;
  let investment = 0;
  let debt = 0;

  // -------------------------
  // 1. SAFE AGGREGATION
  // -------------------------
  transactions.forEach((t) => {
    const amount = Number(t.amount) || 0;

    if (t.type === "income") income += amount;
    else if (t.type === "expense") expense += amount;
    else if (t.type === "investment") investment += amount;
    else if (t.type === "debt") debt += amount;
  });

  // -------------------------
  // 2. SAFETY CHECK
  // -------------------------
  if (income <= 0) {
    return {
      score: 0,
      category: "At Risk",
      breakdown: {
        emergencyFund: 0,
        savingsRate: 0,
        debtRatio: 0,
        investmentRatio: 0,
      },
      suggestions: ["Start tracking your income and expenses"],
    };
  }

  const savings = income - expense;

  const savingsRate = (savings / income) * 100;
  const expenseRate = expense / income;
  const debtRatio = debt / income;
  const investmentRatio = investment / income;

  // -------------------------
  // 3. EMERGENCY FUND (25)
  // -------------------------
  const monthlyExpenses = expense;
  const emergencyFundMonths =
    monthlyExpenses > 0 ? savings / monthlyExpenses : 999;

  let emergencyFund = 0;

  if (emergencyFundMonths < 1) emergencyFund = 5;
  else if (emergencyFundMonths < 3) emergencyFund = 10;
  else if (emergencyFundMonths < 6) emergencyFund = 20;
  else emergencyFund = 25;

  // -------------------------
  // 4. SAVINGS RATE (25)
  // -------------------------
  let savingsScore = 0;

  if (savingsRate < 10) savingsScore = 5;
  else if (savingsRate < 20) savingsScore = 10;
  else if (savingsRate < 40) savingsScore = 20;
  else savingsScore = 25;

  // -------------------------
  // 5. DEBT SCORE (25)
  // -------------------------
  let debtScore = 0;

  if (debtRatio > 50) debtScore = 5;
  else if (debtRatio > 30) debtScore = 10;
  else if (debtRatio > 10) debtScore = 20;
  else debtScore = 25;

  // -------------------------
  // 6. INVESTMENT SCORE (25)
  // -------------------------
  let investmentScore = 0;

  if (investmentRatio < 5) investmentScore = 5;
  else if (investmentRatio < 15) investmentScore = 10;
  else if (investmentRatio < 30) investmentScore = 20;
  else investmentScore = 25;

  // -------------------------
  // 7. FINAL SCORE
  // -------------------------
  let score =
    emergencyFund +
    savingsScore +
    debtScore +
    investmentScore;

  // clamp score
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  // -------------------------
  // 8. CATEGORY
  // -------------------------
  let category = "At Risk";

  if (score >= 80) category = "Excellent";
  else if (score >= 60) category = "Healthy";
  else if (score >= 40) category = "Moderate";

  // -------------------------
  // 9. SUGGESTIONS
  // -------------------------
  const suggestions = [];

  if (emergencyFund < 20)
    suggestions.push("Build an emergency fund for 3–6 months");

  if (savingsRate < 20)
    suggestions.push("Increase your savings rate to at least 20%");

  if (debtRatio > 20)
    suggestions.push("Reduce your debt burden");

  if (investmentRatio < 10)
    suggestions.push("Start investing at least 10% of your income");

  return {
    score: Math.round(score),
    category,
    breakdown: {
      emergencyFund,
      savingsRate: savingsScore,
      debtRatio: debtScore,
      investmentRatio: investmentScore,
    },
    ratios: {
      savingsRate: Number(savingsRate.toFixed(1)),
      expenseRate: Number(expenseRate.toFixed(2)),
      debtRatio: Number(debtRatio.toFixed(2)),
      investmentRatio: Number(investmentRatio.toFixed(2)),
    },
    suggestions,
  };
};

export default calculateFinancialHealth;