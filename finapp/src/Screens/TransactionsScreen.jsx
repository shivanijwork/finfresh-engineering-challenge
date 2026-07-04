import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTransactions } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export default function TransactionsScreen() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
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

            const res = await getTransactions(token);
            setTransactions(res?.data?.data?.data || []);
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
    }, []);

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
                        <Text className="text-gray-400 mt-1">All your recorded transactions</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("AddTransaction")}
                        className="bg-[#30D5FF] px-4 py-3 rounded-full"
                    >
                        <Text className="text-white font-bold">Add</Text>
                    </TouchableOpacity>
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
                        </View>
                    ))
                ) : (
                    <View className="bg-white rounded-[30px] p-8 border border-[#EFEAE3]">
                        <Text className="text-gray-500 text-center">No transactions found yet.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
