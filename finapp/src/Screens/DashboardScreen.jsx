import { useEffect, useState } from "react";

import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Dimensions,
} from "react-native";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

import {
    getSummary,
    getFinancialHealth,
    getTransactions,
    getProfile,
    getBudgetHistory,
} from "../services/api";
import {
    useNavigation,
    useIsFocused,
} from "@react-navigation/native";

import {
    LineChart,
    BarChart,
    PieChart,
} from "react-native-chart-kit";

import {
    cardShadow,
    heroShadow,
    buttonShadow,
} from "../theme/theme";

export default function DashboardScreen() {

    const [loading, setLoading] =
        useState(true);

    const [summary, setSummary] =
        useState(null);
    const [budgetGoals, setBudgetGoals] = useState(null);

    const [
        financialHealth,
        setFinancialHealth
    ] = useState(null);

    const [monthlyTrend, setMonthlyTrend] =
        useState({
            labels: [],
            income: [],
            expense: [],
        });

    const [showBudgetDetails, setShowBudgetDetails] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
    const dashboardTabs = ["Overview", "Budget", "Analytics"];

    const [history, setHistory] = useState([]);
    const [compareTotals, setCompareTotals] =
        useState({
            current: 0,
            previous: 0,
        });

    const navigation =
        useNavigation();
    const isFocused = useIsFocused();

    const chartWidth =
        Dimensions.get("window").width - 64;

    const currentMonthLabel =
        new Date().toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric",
            }
        );

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) =>
            `rgba(48, 213, 255, ${opacity})`,
        labelColor: (opacity = 1) =>
            `rgba(75, 85, 99, ${opacity})`,
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#30D5FF",
        },
        propsForBackgroundLines: {
            strokeDasharray: "3",
            stroke: "rgba(220, 234, 255, 0.6)",
        },
        fillShadowGradient: "#30D5FF",
        fillShadowGradientOpacity: 0.15,
    };

    const formatDate = (date) =>
        date.toISOString().slice(0, 10);

    const getMonthKey = (date) =>
        `${date.getFullYear()}-${date.getMonth()}`;

    const getMonthLabel = (date) =>
        date.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });

    const fetchTrendData = async (token) => {
        const now = new Date();
        const startDate = new Date(
            now.getFullYear(),
            now.getMonth() - 2,
            1
        );
        const endDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59
        );

        const trendRes = await getTransactions(token, {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
        });

        const transactions =
            trendRes?.data?.data?.data || [];

        const months = [];
        for (let i = 2; i >= 0; i -= 1) {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );
            months.push({
                key: getMonthKey(date),
                date,
                income: 0,
                expense: 0,
            });
        }

        const monthMap = {};
        months.forEach((month) => {
            monthMap[month.key] = month;
        });

        transactions.forEach((transaction) => {
            const txnDate = new Date(transaction.date);
            const key = getMonthKey(txnDate);
            const month = monthMap[key];
            if (!month) return;
            const amount = Number(transaction.amount) || 0;
            if (transaction.type === "income") {
                month.income += amount;
            }
            if (transaction.type === "expense") {
                month.expense += amount;
            }
        });

        const labels = months.map((month) => getMonthLabel(month.date));
        const incomeValues = months.map((month) => month.income);
        const expenseValues = months.map((month) => month.expense);

        setMonthlyTrend({
            labels,
            income: incomeValues,
            expense: expenseValues,
        });

        setCompareTotals({
            current: incomeValues[2] - expenseValues[2],
            previous: incomeValues[1] - expenseValues[1],
        });
    };

    const fetchData = async () => {

        try {

            setLoading(true);

            const token =
                await AsyncStorage.getItem(
                    "token"
                );

            console.log(
                "TOKEN",
                token
            );

            if (!token) {

                setLoading(false);

                Alert.alert(
                    "Error",
                    "Login again"
                );

                navigation.navigate(
                    "Login"
                );

                return;

            }

            const profileRes = await getProfile(token);
            const summaryRes =
                await getSummary(
                    token
                );

            console.log(
                "SUMMARY",
                summaryRes.data
            );

            const healthRes =
                await getFinancialHealth(
                    token
                );

            const historyRes = await getBudgetHistory(token);

            console.log(
                "HEALTH",
                healthRes.data
            );

            setSummary(
                summaryRes?.data?.data
                ||
                {}
            );

            setBudgetGoals(
                profileRes?.data?.data?.user?.budgetGoals
                ||
                {}
            );

            setHistory(historyRes?.data?.data || []);

            setFinancialHealth(
                healthRes?.data?.data
                ||
                {}
            );

            await fetchTrendData(token);

        }
        catch (error) {

            console.log(
                "DASHBOARD ERROR",
                error?.response?.data
                ||
                error
            );

            Alert.alert(
                "Error",
                error?.response?.data?.message
                ||
                "Dashboard load failed"
            );

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    const incomeValue = summary?.income || 0;
    const expenseValue = summary?.expense || 0;
    const maxChartValue = Math.max(incomeValue, expenseValue, 1);
    const incomeRatio = Math.round((incomeValue / maxChartValue) * 100);
    const expenseRatio = Math.round((expenseValue / maxChartValue) * 100);
    const cashFlowValue = incomeValue - expenseValue;
    const topCategories = Object.entries(summary?.categories || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);
    const categoryTotal = topCategories.reduce((sum, [, value]) => sum + value, 0) || 1;
    const categoryColors = ["#30D5FF", "#F97316", "#10B981", "#A855F7"];

    const monthlyLimit = budgetGoals?.monthlyLimit || 0;
    const savingsGoal = budgetGoals?.savingsGoal || 0;
    const debtGoal = budgetGoals?.debtGoal || 0;
    const cycleStartDay = budgetGoals?.cycleStartDay || 1;
    const categoryBudgets = budgetGoals?.categoryBudgets || {};

    const monthlyUsageRatio = monthlyLimit > 0 ? Math.min((expenseValue / monthlyLimit) * 100, 100) : 0;
    const savingsProgressRatio = savingsGoal > 0 ? Math.min(((summary?.savings || 0) / savingsGoal) * 100, 100) : 0;
    const debtProgressRatio = debtGoal > 0 ? Math.min(((summary?.debt || 0) / debtGoal) * 100, 100) : 0;

    const budgetStatus = monthlyLimit > 0
        ? monthlyUsageRatio >= 100
            ? "Over budget"
            : monthlyUsageRatio >= 80
                ? "Near limit"
                : "On track"
        : "No monthly budget set";

    const budgetStatusColor = monthlyLimit > 0
        ? monthlyUsageRatio >= 100
            ? "#DC2626"
            : monthlyUsageRatio >= 80
                ? "#F97316"
                : "#10B981"
        : "#6B7280";

    const categoryBudgetList = Object.entries(categoryBudgets).map(([category, limit]) => {
        const spent = summary?.categories?.[category] || 0;
        const ratio = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        return {
            category,
            limit,
            spent,
            ratio,
            isNearLimit: ratio >= 80,
        };
    });

    const budgetAlerts = [];
    if (monthlyLimit > 0 && monthlyUsageRatio >= 80) {
        budgetAlerts.push("You're close to your monthly spending limit.");
    }
    categoryBudgetList.forEach((item) => {
        if (item.isNearLimit) {
            budgetAlerts.push(`Spending is near limit for ${item.category}.`);
        }
    });
    if (budgetAlerts.length > 2) {
        budgetAlerts.length = 2;
    }

    if (loading) {

        return (

            <View
                className="
flex-1
justify-center
items-center
bg-[#FCFCFA]
"
            >

                <ActivityIndicator
                    size="large"
                    color="#30D5FF"
                />

                <Text
                    className="mt-3"
                >

                    Loading Dashboard...

                </Text>

            </View>

        );

    }

    return (

        <ScrollView
            className="
flex-1
bg-[#FCFCFA]
"
            showsVerticalScrollIndicator={false}
        >

            <View
                className="
px-6
pt-16
pb-40
"
            >

                {/* HEADER */}

                <View
                    className="
flex-row
justify-between
items-center
"
                >

                    <View>

                        <Text
                            className="
text-[#D6A34F]
text-3xl
font-black
"
                        >

                            FINFRESH

                        </Text>

                        <Text
                            className="
text-gray-400
mt-1
"
                        >

                            {`Your financial snapshot · ${currentMonthLabel}`}

                        </Text>

                    </View>

                    <View
                        className="
w-12
h-12
rounded-full
bg-[#30D5FF]
justify-center
items-center
"
                    >

                        <Text
                            className="
text-white
font-bold
"
                        >

                            ₹

                        </Text>

                    </View>

                </View>


                {/* HERO */}

                <View
                    style={heroShadow}
                    className="
mt-10
bg-[#111]
rounded-[34px]
p-8
"
                >

                    <Text
                        className="
text-white/60
"
                    >

                        Current Savings

                    </Text>

                    <Text
                        className="
text-white
text-[42px]
font-black
mt-2
"
                    >

                        ₹{summary?.savings || 0}

                    </Text>

                    <Text
                        className="
text-[#30D5FF]
mt-3
"
                    >

                        Savings Rate ·
                        {" "}
                        {summary?.savingsRate || 0}%

                    </Text>

                </View>

                <View style={cardShadow} className="bg-white rounded-[30px] p-6 mt-6 border border-[#EFEAE3]">
                    <Text className="text-xl font-black mb-4">Monthly snapshot</Text>
                    <View className="flex-row flex-wrap justify-between">
                        <View className="w-[48%] mb-4">
                            <Text className="text-gray-500">Income</Text>
                            <Text className="text-[#111] font-bold text-xl mt-1">₹{incomeValue}</Text>
                        </View>
                        <View className="w-[48%] mb-4">
                            <Text className="text-gray-500">Expense</Text>
                            <Text className="text-[#111] font-bold text-xl mt-1">₹{expenseValue}</Text>
                        </View>
                        <View className="w-[48%] mb-4">
                            <Text className="text-gray-500">Savings</Text>
                            <Text className="text-[#111] font-bold text-xl mt-1">₹{summary?.savings || 0}</Text>
                        </View>
                        <View className="w-[48%] mb-4">
                            <Text className="text-gray-500">Debt</Text>
                            <Text className="text-[#111] font-bold text-xl mt-1">₹{summary?.debt || 0}</Text>
                        </View>
                    </View>
                    <View className="mt-3 bg-[#EFF6FF] rounded-[24px] p-4 border border-[#BFDBFE]">
                        <Text className="text-gray-500">Cash flow</Text>
                        <Text className="text-2xl font-bold text-[#0EA5E9] mt-2">{cashFlowValue >= 0 ? `₹${cashFlowValue}` : `-₹${Math.abs(cashFlowValue)}`}</Text>
                    </View>
                </View>

                <View className="mt-6 flex-row rounded-[30px] overflow-hidden border border-[#EFEAE3]" style={cardShadow}>
                    {dashboardTabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-3 items-center ${activeTab === tab ? "bg-[#EFF6FF]" : "bg-white"}`}
                        >
                            <Text className={`font-semibold ${activeTab === tab ? "text-[#111]" : "text-[#6B7280]"}`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {activeTab === "Overview" && (
                    <View className="space-y-6 mt-6">
                        <View style={cardShadow} className="bg-white rounded-[30px] p-5 border border-[#EFEAE3]">
                            <View className="flex-row justify-between items-center mb-4">
                                <View>
                                    <Text className="text-xl font-black">Budget pulse</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Your current spending status.</Text>
                                </View>
                                <View className={`rounded-full px-3 py-1`} style={{ backgroundColor: `${budgetStatusColor}20` }}>
                                    <Text style={{ color: budgetStatusColor }} className="font-semibold text-xs">
                                        {budgetStatus}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-sm text-gray-500 mb-3">{budgetAlerts.length ? budgetAlerts[0] : "Budget status looks healthy this month."}</Text>
                            <View className="bg-[#F7F7F5] h-3 rounded-full overflow-hidden">
                                <View className="h-3 rounded-full bg-[#30D5FF]" style={{ width: `${monthlyUsageRatio}%` }} />
                            </View>
                        </View>

                        <View className="flex-row justify-between gap-3 mt-4 mb-4">
                            <TouchableOpacity onPress={() => navigation.navigate("BudgetGoals")} className="flex-1 bg-[#10B981] rounded-[28px] p-4">
                                <Text className="text-white text-center font-bold">Budget Goals</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Transactions")} className="flex-1 bg-[#30D5FF] rounded-[28px] p-4">
                                <Text className="text-white text-center font-bold">Transactions</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row flex-wrap justify-between">
                            <Card title="Income" value={`₹${incomeValue}`} />
                            <Card title="Expense" value={`₹${expenseValue}`} />
                            <Card title="Savings" value={`₹${summary?.savings || 0}`} />
                            <Card title="Debt" value={`₹${summary?.debt || 0}`} />
                        </View>
                    </View>
                )}

                {activeTab === "Budget" && (
                    <View className="space-y-6 mt-6">
                        <View style={cardShadow} className="bg-white rounded-[30px] p-5 border border-[#EFEAE3]">
                            <View className="flex-row justify-between items-center mb-4">
                                <View className="flex-1 pr-3">
                                    <Text className="text-xl font-black">Budget overview</Text>
                                    <Text className="text-gray-500 text-sm mt-1">A focused view of your budget goals.</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowBudgetDetails((prev) => !prev)}
                                    accessibilityLabel={showBudgetDetails ? "Hide details" : "Show details"}
                                    className="bg-[#F7F7F5] rounded-full w-10 h-10 items-center justify-center"
                                >
                                    <Ionicons name={showBudgetDetails ? "chevron-up" : "chevron-down"} size={20} color="#111" />
                                </TouchableOpacity>
                            </View>
                            <View className="space-y-4">
                                <View>
                                    <Text className="text-gray-500">Monthly limit</Text>
                                    <Text className="text-[#111] font-bold text-xl mt-1">₹{monthlyLimit}</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-500">Savings goal</Text>
                                    <Text className="text-[#111] font-bold text-xl mt-1">₹{savingsGoal}</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-500">Debt goal</Text>
                                    <Text className="text-[#111] font-bold text-xl mt-1">₹{debtGoal}</Text>
                                </View>
                            </View>
                            {showBudgetDetails && (
                                <View className="mt-5 pt-4 border-t border-[#EFEAE3] space-y-4">
                                    {categoryBudgetList.length > 0 ? (
                                        categoryBudgetList.map((item) => (
                                            <View key={item.category} className="space-y-2">
                                                <View className="flex-row justify-between items-center">
                                                    <Text className="text-gray-500">{item.category}</Text>
                                                    <Text className="font-semibold">₹{item.limit}</Text>
                                                </View>
                                                <View className="bg-[#F7F7F5] h-2 rounded-full overflow-hidden">
                                                    <View
                                                        className={`h-2 rounded-full ${item.ratio >= 80 ? "bg-[#F97316]" : "bg-[#30D5FF]"}`}
                                                        style={{ width: `${item.ratio}%` }}
                                                    />
                                                </View>
                                                <Text className="text-xs text-gray-400">₹{item.spent} of ₹{item.limit}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text className="text-gray-400">No category budgets available.</Text>
                                    )}
                                </View>
                            )}
                        </View>

                        <View style={cardShadow} className="bg-white rounded-[30px] p-5 border border-[#EFEAE3] mt-4">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-black">Cycle history</Text>
                                <Text className="text-sm text-gray-500">Latest month</Text>
                            </View>
                            {history.length ? (
                                <View className="space-y-3">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-gray-500 text-sm">{history[0].label}</Text>
                                        <Text className="text-sm font-semibold text-[#111]">₹{history[0].expense}</Text>
                                    </View>
                                    <View className="bg-[#F7F7F5] h-3 rounded-full overflow-hidden mt-1 mb-1">
                                        <View className="h-3 rounded-full bg-[#30D5FF]" style={{ width: `${history[0].monthlyLimit > 0 ? Math.min((history[0].expense / history[0].monthlyLimit) * 100, 100) : 0}%` }} />
                                    </View>
                                    <Text className="text-xs text-gray-400">Income ₹{history[0].income} · Savings ₹{history[0].savings}</Text>
                                </View>
                            ) : (
                                <Text className="text-gray-400">No cycle history yet.</Text>
                            )}
                        </View>
                    </View>
                )}

                {activeTab === "Analytics" && (
                    <View className="space-y-6 mt-6">
                        <View style={cardShadow} className="bg-white rounded-[30px] p-5 border border-[#EFEAE3]">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-black">Spending breakdown</Text>
                                <TouchableOpacity onPress={() => setShowBreakdown((prev) => !prev)}>
                                    <Text className="text-[#30D5FF] font-semibold">{showBreakdown ? "Collapse" : "Expand"}</Text>
                                </TouchableOpacity>
                            </View>
                            {showBreakdown ? (
                                Object.keys(summary?.categories || {}).length ? (
                                    Object.entries(summary.categories).map(([k, v]) => (
                                        <View key={k} className="flex-row justify-between mb-4">
                                            <Text className="text-gray-500">{k}</Text>
                                            <Text className="font-bold">₹{v}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text className="text-gray-400">No transaction data</Text>
                                )
                            ) : (
                                <View className="bg-[#F8FAFC] rounded-[24px] p-4">
                                    <Text className="text-gray-500">Tap to reveal detailed category spending.</Text>
                                </View>
                            )}
                        </View>

                        <View style={cardShadow} className="bg-white rounded-[30px] p-5 border border-[#EFEAE3] mt-4">
                            <Text className="text-xl font-black mb-3">Analytics</Text>
                            <Text className="text-gray-500 mb-4 text-sm">Premium charts for income, expense, and monthly trends.</Text>

                            <Text className="text-gray-500 mb-2">Income vs Expense</Text>
                            <BarChart
                                data={{
                                    labels: ["Income", "Expense"],
                                    datasets: [{
                                        data: [incomeValue, expenseValue],
                                    }],
                                }}
                                width={chartWidth}
                                height={180}
                                yAxisLabel="₹"
                                chartConfig={chartConfig}
                                fromZero
                                showValuesOnTopOfBars
                                style={{
                                    borderRadius: 16,
                                    marginBottom: 14,
                                }}
                            />

                            <Text className="text-gray-500 mb-2">Monthly trend</Text>
                            <LineChart
                                data={{
                                    labels: monthlyTrend.labels,
                                    datasets: [
                                        {
                                            data: monthlyTrend.income,
                                            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                                            strokeWidth: 2,
                                        },
                                        {
                                            data: monthlyTrend.expense,
                                            color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                                            strokeWidth: 2,
                                        },
                                    ],
                                    legend: ["Income", "Expense"],
                                }}
                                width={chartWidth}
                                height={170}
                                chartConfig={chartConfig}
                                bezier
                                style={{
                                    borderRadius: 16,
                                }}
                            />

                            <View className="mt-4 bg-[#F0F9FF] rounded-[26px] p-4 border border-[#BFDBFE]">
                                <Text className="text-sm text-[#475569] mb-2">Cash flow comparison</Text>
                                <View className="flex-row justify-between">
                                    <View>
                                        <Text className="text-xs text-[#64748B]">Previous</Text>
                                        <Text className="text-lg font-bold text-[#1E40AF]">₹{compareTotals.previous}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-xs text-[#64748B]">Current</Text>
                                        <Text className="text-lg font-bold text-[#0EA5E9]">₹{compareTotals.current}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text className="text-xl font-black mb-5 mt-4 ml-1">Insights</Text>
                            {financialHealth?.suggestions?.length ? (
                                financialHealth.suggestions.map((item, index) => (
                                    <View key={index} className="bg-[#F7F7F5] border border-[#EFEAE3] rounded-[24px] p-5 mb-4">
                                        <Text className="leading-7 text-gray-700">{item}</Text>
                                    </View>
                                ))
                            ) : (
                                <View className="bg-white rounded-[24px] p-6">
                                    <Text className="text-gray-500">Your financial health looks stable.</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

            </View>


            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(
                        "AddTransaction"
                    )
                }
                style={buttonShadow}
                className="
absolute
bottom-8
left-6
right-6
bg-[#30D5FF]
rounded-full
py-5
"
            >

                <Text
                    className="
text-white
font-bold
text-center
text-lg
"
                >

                    Add Transaction

                </Text>

            </TouchableOpacity>

        </ScrollView>

    );
}

function Card({
    title,
    value,
    subtitle
}) {

    return (

        <View
            style={cardShadow}
            className="
bg-white
w-[48%]
rounded-[28px]
p-6
mb-4
border
border-[#EFEAE3]
"
        >

            <Text
                className="
text-gray-400
"
            >

                {title}

            </Text>

            <Text
                className="
text-[28px]
font-black
mt-3
text-[#111]
"
            >

                {value}

            </Text>

            {

                subtitle && (

                    <Text
                        className="
text-[#30D5FF]
mt-2
"
                    >

                        {subtitle}

                    </Text>

                )

            }

        </View>

    );

}