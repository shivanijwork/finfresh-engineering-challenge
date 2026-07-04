import { useEffect, useState } from "react";

import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import {
    getSummary,
    getFinancialHealth,
} from "../services/api";
import {
    useNavigation,
} from "@react-navigation/native";

export default function DashboardScreen() {

    const [loading, setLoading] =
        useState(true);

    const [summary, setSummary] =
        useState(null);

    const [
        financialHealth,
        setFinancialHealth
    ] = useState(null);
    const navigation =
        useNavigation();

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

            console.log(
                "HEALTH",
                healthRes.data
            );

            setSummary(
                summaryRes?.data?.data
                ||
                {}
            );

            setFinancialHealth(
                healthRes?.data?.data
                ||
                {}
            );

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

        fetchData();

    }, []);

    if (loading) {

        return (

            <View
                className="
flex-1
justify-center
items-center
bg-[#F7F8FA]
"
            >

                <ActivityIndicator
                    size="large"
                    color="#f97316"
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

                            Your financial snapshot

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


                {/* GRID */}

                <View
                    className="
mt-8
flex-row
flex-wrap
justify-between
"
                >

                    <Card
                        title="Income"
                        value={`₹${summary?.income || 0}`}
                    />

                    <Card
                        title="Expense"
                        value={`₹${summary?.expense || 0}`}
                    />

                    <Card
                        title="Health"
                        value={`${financialHealth?.score || 0}`}

                        subtitle={
                            financialHealth?.category
                        }
                    />

                    <Card
                        title="Categories"
                        value={
                            Object.keys(
                                summary?.categories
                                ||
                                {}
                            ).length
                        }
                    />

                </View>


                {/* CATEGORY */}

                <View
                    className="
bg-white
rounded-[30px]
p-7
mt-8
border
border-[#EFEAE3]
"
                >

                    <Text
                        className="
text-xl
font-black
mb-6
"
                    >

                        Spending Breakdown

                    </Text>

                    {

                        Object.keys(
                            summary?.categories
                            ||
                            {}
                        ).length

                            ?

                            Object.entries(
                                summary.categories
                            ).map(
                                ([k, v]) => (

                                    <View
                                        key={k}
                                        className="
flex-row
justify-between
mb-5
"
                                    >

                                        <Text
                                            className="
text-gray-500
"
                                        >

                                            {k}

                                        </Text>

                                        <Text
                                            className="
font-bold
"
                                        >

                                            ₹{v}

                                        </Text>

                                    </View>

                                )
                            )

                            :

                            <Text
                                className="
text-gray-400
"
                            >

                                No transaction data

                            </Text>

                    }

                </View>


                {/* INSIGHTS */}

                <TouchableOpacity
                    onPress={() => navigation.navigate("Transactions")}
                    className="
mt-8
bg-[#30D5FF]
rounded-[30px]
p-5
mb-6
"
                >

                    <Text
                        className="
text-white
text-lg
font-bold
text-center
"
                    >

                        View Transaction History

                    </Text>

                </TouchableOpacity>

                <View
                    className="
mt-8
"
                >

                    <Text
                        className="
text-xl
font-black
mb-5
"
                    >

                        Insights

                    </Text>

                    {

                        financialHealth
                            ?.suggestions
                            ?.length

                            ?

                            financialHealth
                                .suggestions
                                .map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <View
                                            key={index}
                                            className="
bg-[#F7F7F5]
border
border-[#EFEAE3]
rounded-[24px]
p-5
mb-4
"
                                        >

                                            <Text
                                                className="
leading-7
text-gray-700
"
                                            >

                                                {item}

                                            </Text>

                                        </View>

                                    )
                                )

                            :

                            <View
                                className="
bg-white
rounded-[24px]
p-6
"
                            >

                                <Text
                                    className="
text-gray-500
"
                                >

                                    Your financial health looks stable.

                                </Text>

                            </View>

                    }

                </View>

            </View>


            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(
                        "AddTransaction"
                    )
                }
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