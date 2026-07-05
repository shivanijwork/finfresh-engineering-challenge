import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getProfile, updateProfile } from "../services/api";
import KeyboardWrapper from "../../Components/KeyboardWrapper";
import { buttonShadow, cardShadow } from "../theme/theme";

const budgetLabels = [
    { key: "monthlyLimit", label: "Monthly spending limit", placeholder: "₹0" },
    { key: "savingsGoal", label: "Savings goal", placeholder: "₹0" },
    { key: "debtGoal", label: "Debt payoff goal", placeholder: "₹0" },
];

export default function BudgetGoalsScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [token, setToken] = useState(null);
    const [goals, setGoals] = useState({
        monthlyLimit: "",
        savingsGoal: "",
        debtGoal: "",
        debtPayoffDate: "",
    });
    const [categoryBudgets, setCategoryBudgets] = useState({});
    const [newCategory, setNewCategory] = useState("");
    const [newCategoryAmount, setNewCategoryAmount] = useState("");

    useEffect(() => {
        const loadBudgetGoals = async () => {
            const storedToken = await AsyncStorage.getItem("token");
            if (!storedToken) {
                Alert.alert("Error", "Please sign in again.");
                navigation.navigate("Login");
                return;
            }
            setToken(storedToken);

            try {
                const profileRes = await getProfile(storedToken);
                const profile = profileRes?.data?.data?.user || {};
                const budgetGoals = profile.budgetGoals || {};
                setGoals({
                    monthlyLimit: budgetGoals.monthlyLimit?.toString() || "",
                    savingsGoal: budgetGoals.savingsGoal?.toString() || "",
                    debtGoal: budgetGoals.debtGoal?.toString() || "",
                    debtPayoffDate: budgetGoals.debtPayoffDate
                        ? new Date(budgetGoals.debtPayoffDate).toISOString().slice(0, 10)
                        : "",
                });
                setCategoryBudgets(
                    Object.fromEntries(
                        Object.entries(budgetGoals.categoryBudgets || {}).map(([key, value]) => [key, value?.toString() || ""]),
                    ),
                );
            } catch (error) {
                console.log("BUDGET GOALS LOAD ERROR", error?.response ?? error);
                Alert.alert("Error", "Unable to load budget goals.");
            } finally {
                setLoading(false);
            }
        };
        loadBudgetGoals();
    }, [navigation]);

    const setGoal = (key, value) => {
        setGoals((prev) => ({ ...prev, [key]: value }));
    };

    const handleRemoveCategory = (category) => {
        const updated = { ...categoryBudgets };
        delete updated[category];
        setCategoryBudgets(updated);
    };

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            Alert.alert("Error", "Category name is required.");
            return;
        }
        if (!newCategoryAmount.trim() || Number(newCategoryAmount) <= 0) {
            Alert.alert("Error", "Budget amount must be greater than zero.");
            return;
        }
        setCategoryBudgets((prev) => ({
            ...prev,
            [newCategory.trim()]: newCategoryAmount.trim(),
        }));
        setNewCategory("");
        setNewCategoryAmount("");
    };

    const handleSave = async () => {
        if (!token) {
            Alert.alert("Error", "Please sign in again.");
            return;
        }

        setSaving(true);

        try {
            const budgetGoals = {
                monthlyLimit: Number(goals.monthlyLimit) || 0,
                savingsGoal: Number(goals.savingsGoal) || 0,
                debtGoal: Number(goals.debtGoal) || 0,
                debtPayoffDate: goals.debtPayoffDate || null,
                categoryBudgets: Object.fromEntries(
                    Object.entries(categoryBudgets).map(([key, value]) => [key, Number(value) || 0]),
                ),
            };

            const res = await updateProfile({ budgetGoals }, token);
            const updatedUser = res?.data?.data?.user;
            if (updatedUser) {
                await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
            }
            Alert.alert("Saved", "Budget goals updated successfully.", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.log("BUDGET GOALS SAVE ERROR", error?.response ?? error);
            Alert.alert("Error", error?.response?.data?.message || "Unable to save budget goals.");
        } finally {
            setSaving(false);
        }
    };

    const renderProgress = (value, target) => {
        const numericValue = Number(value) || 0;
        const numericTarget = Number(target) || 0;
        const ratio = numericTarget > 0 ? Math.min((numericValue / numericTarget) * 100, 100) : 0;
        return (
            <View className="bg-[#F3F4F6] rounded-full h-3 overflow-hidden mt-2">
                <View className="h-3 rounded-full bg-[#30D5FF]" style={{ width: `${ratio}%` }} />
            </View>
        );
    };

    const formattedCategoryBudgets = Object.entries(categoryBudgets).map(([category, amount]) => ({ category, amount }));

    return (
        <KeyboardWrapper className="flex-1 bg-[#FCFCFA]">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="pt-16 pb-24">
                    <View className="flex-row justify-between items-center mb-8">
                        <View>
                            <Text className="text-3xl font-black text-[#111]">Budget goals</Text>
                            <Text className="text-gray-400 mt-1">Set targets and track your spending progress.</Text>
                        </View>
                    </View>

                    {loading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator color="#30D5FF" />
                        </View>
                    ) : (
                        <View className="space-y-6">
                            <View style={cardShadow} className="bg-white rounded-[30px] p-6 border border-[#EFEAE3]">
                                {budgetLabels.map((item) => (
                                    <View key={item.key} className="mb-5">
                                        <Text className="text-gray-500 mb-2">{item.label}</Text>
                                        <TextInput
                                            value={goals[item.key]}
                                            onChangeText={(text) => setGoal(item.key, text)}
                                            keyboardType="numeric"
                                            placeholder={item.placeholder}
                                            placeholderTextColor="#9CA3AF"
                                            className="bg-[#F7F7F7] rounded-[24px] px-4 py-4 text-[#111] border border-[#E5E7EB]"
                                        />
                                    </View>
                                ))}
                                <View className="mb-5">
                                    <Text className="text-gray-500 mb-2">Debt payoff target</Text>
                                    <TextInput
                                        value={goals.debtPayoffDate}
                                        onChangeText={(text) => setGoal("debtPayoffDate", text)}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor="#9CA3AF"
                                        className="bg-[#F7F7F7] rounded-[24px] px-4 py-4 text-[#111] border border-[#E5E7EB]"
                                    />
                                </View>
                            </View>

                            <View style={cardShadow} className="bg-white rounded-[30px] p-6 border border-[#EFEAE3]">
                                <Text className="text-xl font-black mb-4">Category budgets</Text>
                                {formattedCategoryBudgets.length ? (
                                    formattedCategoryBudgets.map(({ category, amount }) => (
                                        <View key={category} className="mb-4">
                                            <View className="flex-row justify-between items-center mb-2">
                                                <Text className="text-[#111] font-semibold">{category}</Text>
                                                <Text className="text-[#111] font-bold">₹{amount}</Text>
                                            </View>
                                            {renderProgress(amount, goals.monthlyLimit || 0)}
                                            <TouchableOpacity onPress={() => handleRemoveCategory(category)} className="mt-2">
                                                <Text className="text-[#EF4444]">Remove</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text className="text-gray-400">No category budgets yet.</Text>
                                )}
                                <View className="mt-4 border-t border-[#E5E7EB] pt-4">
                                    <Text className="text-gray-500 mb-2">Add category budget</Text>
                                    <TextInput
                                        value={newCategory}
                                        onChangeText={setNewCategory}
                                        placeholder="Category name"
                                        placeholderTextColor="#9CA3AF"
                                        className="bg-[#F7F7F7] rounded-[24px] px-4 py-4 text-[#111] border border-[#E5E7EB] mb-3"
                                    />
                                    <TextInput
                                        value={newCategoryAmount}
                                        onChangeText={setNewCategoryAmount}
                                        placeholder="Budget amount"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        className="bg-[#F7F7F7] rounded-[24px] px-4 py-4 text-[#111] border border-[#E5E7EB] mb-3"
                                    />
                                    <TouchableOpacity
                                        onPress={handleAddCategory}
                                        activeOpacity={0.9}
                                        className="bg-[#111] rounded-full py-4"
                                    >
                                        <Text className="text-center text-white font-bold">Add category</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={saving}
                                style={buttonShadow}
                                className="bg-[#30D5FF] rounded-full py-4"
                            >
                                {saving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-center text-white font-bold text-lg">Save goals</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardWrapper>
    );
}
