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
            className="flex-1 bg-[#FAFAFA]"
            showsVerticalScrollIndicator={false}
        >

            <View className="px-6 pt-16 pb-32">

                {/* Header */}

                <View className="mb-8">

                    <Text
                        className="
text-[36px]
font-black
text-black
"
                    >
                        FinFresh
                    </Text>

                    <Text
                        className="
text-gray-400
text-base
mt-1
"
                    >
                        Your money at a glance
                    </Text>

                </View>


                {/* Top Stats */}

                <View
                    className="
flex-row
flex-wrap
justify-between
"
                >

                    <Card
                        title="Income"
                        value={`₹${summary?.income || 0}`}
                        color="text-green-600"
                    />

                    <Card
                        title="Expense"
                        value={`₹${summary?.expense || 0}`}
                        color="text-red-500"
                    />

                    <Card
                        title="Savings"
                        value={`₹${summary?.savings || 0}`}
                        subtitle={`${summary?.savingsRate || 0}% rate`}
                    />

                    <Card
                        title="Health"
                        value={`${financialHealth?.score || 0}`}
                        subtitle={
                            financialHealth?.category
                        }
                        color="text-orange-500"
                    />

                </View>


                {/* Categories */}

                <View
                    className="
bg-white
mt-8
rounded-[30px]
p-6
"
                >

                    <Text
                        className="
text-lg
font-bold
mb-5
"
                    >
                        Categories
                    </Text>

                    {
                        Object.keys(
                            summary?.categories || {}
                        ).length

                            ?

                            Object.entries(
                                summary.categories
                            ).map(
                                ([key, value]) => (

                                    <View
                                        key={key}
                                        className="
flex-row
justify-between
py-4
border-b
border-gray-100
"
                                    >

                                        <Text
                                            className="
text-gray-700
"
                                        >
                                            {key}
                                        </Text>

                                        <Text
                                            className="
font-semibold
"
                                        >
                                            ₹{value}
                                        </Text>

                                    </View>

                                ))

                            :

                            <Text
                                className="
text-gray-400
"
                            >
                                No transactions yet
                            </Text>

                    }

                </View>


                {/* Suggestions */}

                <View
                    className="
bg-white
rounded-[30px]
mt-6
p-6
"
                >

                    <Text
                        className="
text-lg
font-bold
mb-4
"
                    >

                        Suggestions

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
bg-orange-50
rounded-2xl
mb-3
p-4
"
                                        >

                                            <Text
                                                className="
leading-6
text-gray-700
"
                                            >

                                                {item}

                                            </Text>

                                        </View>

                                    ))

                            :

                            <Text
                                className="
text-gray-400
"
                            >

                                Looking healthy ✨

                            </Text>

                    }

                </View>

            </View>


            {/* Floating Button */}

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(
                        "AddTransaction"
                    )
                }
                className="
absolute
bottom-10
left-6
right-6
bg-orange-500
rounded-full
py-5
"
            >

                <Text
                    className="
text-white
text-center
font-bold
text-lg
"
                >

                    ＋ Add Transaction

                </Text>

            </TouchableOpacity>

        </ScrollView>

    );

}

function Card({
    title,
    value,
    subtitle,
    color = "text-black",
}) {

    return (

        <View
            className="
bg-white
w-[48%]
rounded-[28px]
p-5
mb-4
"
        >

            <Text
                className="
text-gray-400
text-sm
"
            >
                {title}
            </Text>

            <Text
                className={`
text-[28px]
font-black
mt-3
${color}
`}
            >

                {value}

            </Text>

            {

                subtitle

                &&

                <Text
                    className="
text-gray-400
mt-2
text-sm
"
                >

                    {subtitle}

                </Text>

            }

        </View>

    );

}