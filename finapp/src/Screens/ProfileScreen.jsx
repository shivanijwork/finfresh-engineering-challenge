import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getSummary, getProfile } from "../services/api";
import { cardShadow } from "../theme/theme";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [budgetGoals, setBudgetGoals] = useState({});
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            const storedUser = await AsyncStorage.getItem("user");
            const token = await AsyncStorage.getItem("token");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            if (token) {
                try {
                    const [summaryRes, profileRes] = await Promise.all([
                        getSummary(token),
                        getProfile(token),
                    ]);
                    setSummary(summaryRes?.data?.data || null);
                    const profileUser = profileRes?.data?.data?.user || null;
                    if (profileUser) {
                        setUser(profileUser);
                        setBudgetGoals(profileUser.budgetGoals || {});
                    }
                } catch (error) {
                    console.log("PROFILE LOAD ERROR", error?.response?.data || error);
                }
            }

            setLoading(false);
        };

        if (isFocused) {
            loadProfile();
        }
    }, [isFocused]);

    const logout = async () => {
        await AsyncStorage.clear();
        navigation.replace("Login");
    };

    const profileInitial = user?.name?.trim()?.[0]?.toUpperCase() || "U";
    const netSavings = (summary?.income || 0) - (summary?.expense || 0);
    const monthlyLimit = Number(budgetGoals?.monthlyLimit || 0);
    const savingsGoal = Number(budgetGoals?.savingsGoal || 0);
    const debtGoal = Number(budgetGoals?.debtGoal || 0);
    const monthlySpend = Number(summary?.expense || 0);
    const monthlyRemaining = monthlyLimit > 0 ? Math.max(monthlyLimit - monthlySpend, 0) : 0;
    const monthlyUsageRatio = monthlyLimit > 0 ? Math.min((monthlySpend / monthlyLimit) * 100, 100) : 0;
    const savingsProgress = savingsGoal > 0 ? Math.min(((summary?.savings || 0) / savingsGoal) * 100, 100) : 0;
    const debtProgress = debtGoal > 0 ? Math.min(((summary?.debt || 0) / debtGoal) * 100, 100) : 0;

    return (

        <ScrollView
            className="flex-1 bg-[#FCFCFA]"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
        >

            <View className="px-6 pt-16">

                <View className="flex-row justify-between items-start">
                    <View>
                        <Text className="text-3xl font-black text-[#111]">Profile</Text>
                        <Text className="text-gray-400 mt-1">Your account overview</Text>
                    </View>
                    <View className="w-16 h-16 rounded-full bg-[#30D5FF] justify-center items-center">
                        <Text className="text-white text-2xl font-black">{profileInitial}</Text>
                    </View>
                </View>

                <View
                    className="mt-8 bg-white rounded-[34px] p-6 border border-[#EFEAE3]"
                    style={cardShadow}
                >
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-2xl font-black text-[#111]">{user?.name || "FinFresh User"}</Text>
                            <Text className="text-gray-500 mt-1">{user?.email || "No email available"}</Text>
                        </View>
                        {/* <View className="bg-[#E0F2FE] rounded-full px-4 py-2">
                            <Text className="text-[#2563EB] font-semibold">FinFresh Member</Text>
                        </View> */}
                    </View>

                    <View className="mt-6 bg-[#F7F7F5] rounded-[24px] p-4">
                        <Text className="text-sm text-gray-500">Account status</Text>
                        <Text className="text-lg font-bold text-[#111] mt-2">Active</Text>
                    </View>
                </View>



                <View
                    className="mt-6 bg-white rounded-[34px] p-6 border border-[#EFEAE3]"
                    style={cardShadow}
                >
                    <Text className="text-xl font-black text-[#111]">Financial snapshot</Text>
                    {loading ? (
                        <View className="mt-6 items-center">
                            <ActivityIndicator color="#30D5FF" />
                        </View>
                    ) : (
                        <View className="mt-5 space-y-4">
                            <View className="bg-[#F7F7F5] rounded-[28px] p-4 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-gray-500">Income</Text>
                                    <Text className="text-[#111] font-bold text-xl mt-1">₹{summary?.income || 0}</Text>
                                </View>
                                <Text className="text-sm text-[#10B981] font-semibold">This month</Text>
                            </View>
                            <View className="bg-[#F7F7F5] rounded-[28px] p-4 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-gray-500">Expense</Text>
                                    <Text className="text-[#111] font-bold text-xl mt-1">₹{summary?.expense || 0}</Text>
                                </View>
                                <Text className="text-sm text-[#EF4444] font-semibold">This month</Text>
                            </View>
                            <View className="bg-[#EFF6FF] rounded-[28px] p-4 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-gray-500">Net savings</Text>
                                    <Text className="text-[#111] font-bold text-xl mt-1">₹{netSavings}</Text>
                                </View>
                                <Text className="text-sm text-[#2563EB] font-semibold"> {netSavings > 0 ? "Stable" : "Unstable"}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View
                    className="mt-6 bg-white rounded-[34px] p-6 border border-[#EFEAE3]"
                    style={cardShadow}
                >
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 pr-3">
                            <Text className="text-xl font-black text-[#111]">Budget summary</Text>
                            <Text className="text-gray-400 text-sm mt-1">Quick look at your active spending goals.</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("BudgetGoals")}
                            className="rounded-full bg-[#30D5FF] px-4 py-2"
                        >
                            <Text className="text-white font-semibold">Manage</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="space-y-4">
                        <View className="bg-[#F7F7F5] rounded-[24px] p-4">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-gray-500">Monthly limit</Text>
                                <Text className="text-[#111] font-bold">₹{monthlyLimit}</Text>
                            </View>
                            <View className="bg-[#EFEAE3] h-3 rounded-full overflow-hidden">
                                <View className="h-3 rounded-full bg-[#30D5FF]" style={{ width: `${monthlyUsageRatio}%` }} />
                            </View>
                            <Text className="text-xs text-gray-400 mt-2">
                                {monthlyLimit > 0 ? `${monthlyRemaining > 0 ? `₹${monthlyRemaining} left` : `Limit reached`}` : "No monthly budget set"}
                            </Text>
                        </View>
                        <View className="flex-row justify-between gap-3">
                            <View className="flex-1 bg-[#F7F7F5] rounded-[24px] p-4">
                                <Text className="text-gray-500">Savings goal</Text>
                                <Text className="text-[#111] font-bold text-lg mt-1">₹{savingsGoal}</Text>
                                <View className="bg-[#EFEAE3] h-3 rounded-full overflow-hidden mt-3">
                                    <View className="h-3 rounded-full bg-[#10B981]" style={{ width: `${savingsProgress}%` }} />
                                </View>
                                <Text className="text-xs text-gray-400 mt-2">
                                    {savingsGoal > 0 ? `${Math.round(savingsProgress)}% reached` : "Not set"}
                                </Text>
                            </View>
                            <View className="flex-1 bg-[#F7F7F5] rounded-[24px] p-4">
                                <Text className="text-gray-500">Debt goal</Text>
                                <Text className="text-[#111] font-bold text-lg mt-1">₹{debtGoal}</Text>
                                <View className="bg-[#EFEAE3] h-3 rounded-full overflow-hidden mt-3">
                                    <View className="h-3 rounded-full bg-[#EF4444]" style={{ width: `${debtProgress}%` }} />
                                </View>
                                <Text className="text-xs text-gray-400 mt-2">
                                    {debtGoal > 0 ? `${Math.round(debtProgress)}% progress` : "Not set"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View
                    className="mt-6 bg-white rounded-[34px] p-5 border border-[#EFEAE3]"
                    style={cardShadow}
                >

                    {/* Header */}

                    <View className="mb-5">
                        <Text className="text-lg font-black text-[#111]">
                            Quick Actions
                        </Text>

                        <Text className="text-gray-400 text-sm mt-1">
                            Manage your account faster
                        </Text>
                    </View>


                    {/* Actions */}

                    <TouchableOpacity
                        onPress={() => navigation.navigate("EditProfile")}
                        className="
        flex-row
        items-center
        justify-between
        bg-[#F8FAFC]
        rounded-[22px]
        px-5
        py-4
        border
        border-[#EFEAE3]
        mb-3
        "
                    >

                        <View>
                            <Text className="text-[#111] font-bold">
                                Edit Profile
                            </Text>

                            <Text className="text-gray-400 text-xs mt-1">
                                Update your personal information
                            </Text>
                        </View>

                        <Text className="text-[#30D5FF] text-xl">
                            →
                        </Text>

                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => navigation.navigate("Security")}
                        className="
        flex-row
        items-center
        justify-between
        bg-[#F8FAFC]
        rounded-[22px]
        px-5
        py-4
        border
        border-[#EFEAE3]
        mb-3
        "
                    >

                        <View>

                            <Text className="text-[#111] font-bold">
                                Security
                            </Text>

                            <Text className="text-gray-400 text-xs mt-1">
                                Password & account protection
                            </Text>

                        </View>

                        <Text className="text-[#30D5FF] text-xl">
                            →
                        </Text>

                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => navigation.navigate("BudgetGoals")}
                        className="
        flex-row
        items-center
        justify-between
        bg-[#F8FAFC]
        rounded-[22px]
        px-5
        py-4
        border
        border-[#EFEAE3]
        "
                    >

                        <View>

                            <Text className="text-[#111] font-bold">
                                Budget Goals
                            </Text>

                            <Text className="text-gray-400 text-xs mt-1">
                                Review and update your targets
                            </Text>

                        </View>

                        <Text className="text-[#30D5FF] text-xl">
                            →
                        </Text>

                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    onPress={logout}
                    className="bg-[#111] rounded-full py-4 mt-8 mb-8"
                    style={cardShadow}
                >
                    <Text className="text-center text-white font-bold text-lg">Logout</Text>
                </TouchableOpacity>

            </View>

        </ScrollView>

    );

}