import { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTransactions, deleteTransaction } from "../services/api";
import { useNavigation } from "@react-navigation/native";

const transactionTypes = [
    { value: "all", label: "All" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
    { value: "investment", label: "Investment" },
    { value: "debt", label: "Debt" },
];

export default function TransactionsScreen() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [availableCategories, setAvailableCategories] = useState(["all"]);
    const [filters, setFilters] = useState({ type: "all", category: "all" });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const navigation = useNavigation();

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "Please login again");
                navigation.navigate("Login");
                return;
            }

            const params = {};
            if (filters.type !== "all") params.type = filters.type;
            if (filters.category !== "all") params.category = filters.category;
            if (startDate) params.startDate = startDate.toISOString().slice(0, 10);
            if (endDate) params.endDate = endDate.toISOString().slice(0, 10);

            const res = await getTransactions(token, params);
            const fetchedTransactions = res?.data?.data?.data || [];
            setTransactions(fetchedTransactions);

            const categories = Array.from(
                new Set(
                    fetchedTransactions
                        .map((transaction) => transaction.category)
                        .filter(Boolean)
                )
            );
            setAvailableCategories(["all", ...categories]);
        } catch (error) {
            console.log("TRANSACTIONS ERROR", error?.response?.data || error);
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Unable to load transactions"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters, startDate, endDate]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({ type: "all", category: "all" });
        setStartDate(null);
        setEndDate(null);
    };

    const handleDelete = async (transactionId) => {
        Alert.alert(
            "Delete transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            if (!token) {
                                Alert.alert("Error", "Please login again");
                                navigation.navigate("Login");
                                return;
                            }

                            await deleteTransaction(transactionId, token);
                            fetchTransactions();
                        } catch (error) {
                            console.log("DELETE ERROR", error?.response?.data || error);
                            Alert.alert(
                                "Error",
                                error?.response?.data?.message || "Unable to delete transaction"
                            );
                        }
                    },
                },
            ]
        );
    };

    const filteredTotals = useMemo(() => {
        return transactions.reduce(
            (totals, transaction) => {
                const amount = Number(transaction.amount) || 0;
                if (transaction.type === "income") {
                    totals.income += amount;
                } else if (transaction.type === "expense") {
                    totals.expense += amount;
                } else if (transaction.type === "investment") {
                    totals.investment += amount;
                } else if (transaction.type === "debt") {
                    totals.debt += amount;
                }
                return totals;
            },
            { income: 0, expense: 0, investment: 0, debt: 0 }
        );
    }, [transactions]);

    const onStartDateChange = (event, selectedDate) => {
        if (Platform.OS !== "ios") {
            setShowStartPicker(false);
        }

        if (event.type === "dismissed") return;

        if (selectedDate) {
            setStartDate(selectedDate);
            if (endDate && selectedDate > endDate) {
                setEndDate(selectedDate);
            }
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        if (Platform.OS !== "ios") {
            setShowEndPicker(false);
        }

        if (event.type === "dismissed") return;

        if (selectedDate) {
            setEndDate(selectedDate);
            if (startDate && selectedDate < startDate) {
                setStartDate(selectedDate);
            }
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F7F8FA]">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="mt-3">Loading transactions...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-[#FCFCFA]" showsVerticalScrollIndicator={false}>
            <View className="px-6 pt-16 pb-24">
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-[#D6A34F] text-3xl font-black">Transactions</Text>
                        <Text className="text-gray-400 mt-1">Browse and filter your history</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("AddTransaction")}
                        className="bg-[#30D5FF] px-4 py-3 rounded-full"
                    >
                        <Text className="text-white font-bold">Add</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-white rounded-[30px] p-5 mb-6 border border-[#EFEAE3]">
                    <Text className="text-gray-500 mb-3">Type</Text>
                    <View className="flex-row flex-wrap gap-2 mb-4">
                        {transactionTypes.map((type) => (
                            <TouchableOpacity
                                key={type.value}
                                onPress={() => updateFilter("type", type.value)}
                                className={`py-2 px-4 rounded-full ${
                                    filters.type === type.value
                                        ? "bg-[#30D5FF]"
                                        : "bg-[#F3F4F6]"
                                }`}
                            >
                                <Text
                                    className={`font-semibold ${
                                        filters.type === type.value
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text className="text-gray-500 mb-3">Category</Text>
                    <View className="flex-row flex-wrap gap-2 mb-4">
                        {availableCategories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                onPress={() => updateFilter("category", category)}
                                className={`py-2 px-4 rounded-full ${
                                    filters.category === category
                                        ? "bg-[#30D5FF]"
                                        : "bg-[#F3F4F6]"
                                }`}
                            >
                                <Text
                                    className={`font-semibold ${
                                        filters.category === category
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {category === "all" ? "All" : category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text className="text-gray-500 mb-3">Date range</Text>
                    <View className="flex-row gap-2 mb-4">
                        <TouchableOpacity
                            onPress={() => setShowStartPicker(true)}
                            className="flex-1 bg-[#F3F4F6] rounded-[30px] px-4 py-3"
                        >
                            <Text className="text-gray-700">From</Text>
                            <Text className="text-[#111] font-semibold mt-1">
                                {startDate ? startDate.toLocaleDateString() : "Start date"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowEndPicker(true)}
                            className="flex-1 bg-[#F3F4F6] rounded-[30px] px-4 py-3"
                        >
                            <Text className="text-gray-700">To</Text>
                            <Text className="text-[#111] font-semibold mt-1">
                                {endDate ? endDate.toLocaleDateString() : "End date"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate || new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "calendar"}
                            onChange={onStartDateChange}
                        />
                    )}
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate || new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "calendar"}
                            onChange={onEndDateChange}
                        />
                    )}

                    {(filters.type !== "all" || filters.category !== "all" || startDate || endDate) && (
                        <TouchableOpacity
                            onPress={clearFilters}
                            className="mt-4 self-start bg-[#111] rounded-full px-4 py-2"
                        >
                            <Text className="text-white font-semibold">Clear all filters</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View className="bg-white rounded-[30px] p-5 mb-6 border border-[#EFEAE3]">
                    <Text className="text-gray-500 mb-4">Filtered totals</Text>
                    <View className="flex-row justify-between gap-2">
                        <View className="flex-1 bg-[#F7F7F7] rounded-[24px] p-4 mr-1">
                            <Text className="text-gray-500 text-sm">Income</Text>
                            <Text className="text-[#111] font-bold text-lg">₹{filteredTotals.income}</Text>
                        </View>
                        <View className="flex-1 bg-[#F7F7F7] rounded-[24px] p-4 mx-1">
                            <Text className="text-gray-500 text-sm">Expense</Text>
                            <Text className="text-[#111] font-bold text-lg">₹{filteredTotals.expense}</Text>
                        </View>
                        <View className="flex-1 bg-[#F7F7F7] rounded-[24px] p-4 ml-1">
                            <Text className="text-gray-500 text-sm">Net</Text>
                            <Text className="text-[#111] font-bold text-lg">₹{filteredTotals.income - filteredTotals.expense}</Text>
                        </View>
                    </View>
                </View>

                {transactions.length ? (
                    transactions.map((transaction) => (
                        <View
                            key={transaction._id}
                            className="bg-white rounded-[30px] p-5 mb-4 border border-[#EFEAE3]"
                        >
                            <View className="flex-row justify-between items-start mb-3">
                                <View>
                                    <Text className="text-gray-500">{transaction.category}</Text>
                                    <Text className="text-[#111] font-bold text-lg mt-1">
                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                    </Text>
                                </View>
                                <Text className="text-[#111] font-black text-lg">
                                    ₹{transaction.amount}
                                </Text>
                            </View>
                            <Text className="text-gray-500 mb-2">
                                {new Date(transaction.date).toLocaleDateString()}
                            </Text>
                            {transaction.description ? (
                                <Text className="text-gray-700">{transaction.description}</Text>
                            ) : (
                                <Text className="text-gray-400">No description provided</Text>
                            )}
                            <View className="flex-row justify-end gap-3 mt-4">
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("AddTransaction", { transaction })}
                                    className="bg-[#30D5FF] px-4 py-3 rounded-full"
                                >
                                    <Text className="text-white font-semibold">Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDelete(transaction._id)}
                                    className="bg-[#EF4444] px-4 py-3 rounded-full"
                                >
                                    <Text className="text-white font-semibold">Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="bg-white rounded-[30px] p-8 border border-[#EFEAE3]">
                        <Text className="text-gray-500 text-center">No transactions match these filters.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
