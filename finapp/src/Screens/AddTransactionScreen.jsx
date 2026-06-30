import { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
} from "react-native";

import AsyncStorage
    from "@react-native-async-storage/async-storage";


import {
    useNavigation,
} from "@react-navigation/native";

import {
    createTransaction,
} from "../services/api";

export default function AddTransactionScreen() {

    const navigation =
        useNavigation();

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            type: "expense",
            category: "",
            amount: "",
            description: "",
            date: "",
        });

    const update = (
        key,
        value
    ) => {

        setFormData({
            ...formData,
            [key]: value,
        });

    };

    const validate = () => {

        if (
            !formData.category.trim()
        ) {

            Alert.alert(
                "Error",
                "Category required"
            );

            return false;

        }

        if (
            !formData.amount
            ||
            Number(
                formData.amount
            ) <= 0
        ) {

            Alert.alert(
                "Error",
                "Enter valid amount"
            );

            return false;

        }

        if (
            !formData.date
        ) {

            Alert.alert(
                "Error",
                "Date required"
            );

            return false;

        }

        return true;

    };

    const handleSubmit =
        async () => {

            if (
                !validate()
            ) {

                return;

            }

            try {

                setLoading(true);

                const token =
                    await AsyncStorage.getItem(
                        "token"
                    );

                const payload = {

                    type:
                        formData.type,

                    category:
                        formData.category,

                    amount:
                        Number(
                            formData.amount
                        ),

                    description:
                        formData.description,

                    date:
                        formData.date,

                };

                const res =
                    await createTransaction(
                        payload,
                        token
                    );

                console.log(
                    "TRANSACTION",
                    res.data
                );

                Alert.alert(
                    "Success",
                    "Transaction Added",
                    [
                        {
                            text: "OK",
                            onPress: () =>
                                navigation.navigate("Dashboard"),
                        },
                    ]
                );

            }
            catch (error) {

                console.log(
                    error?.response?.data
                );

                Alert.alert(
                    "Error",
                    error?.response?.data?.message
                    ||
                    "Something went wrong"
                );

            }
            finally {

                setLoading(false);

            }

        };

    return (

        <SafeAreaView
            className="
flex-1
bg-[#FAFAFA]
"
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <View
                    className="
px-6
pt-12
pb-20
"
                >

                    {/* Header */}

                    <View
                        className="
mb-8
"
                    >

                        <Text
                            className="
text-[34px]
font-black
text-black
"
                        >

                            New Transaction

                        </Text>

                        <Text
                            className="
text-gray-400
mt-2
text-base
"
                        >

                            Track every rupee beautifully

                        </Text>

                    </View>


                    {/* FORM CARD */}

                    <View
                        className="
bg-white
rounded-[34px]
p-7
"
                    >

                        {/* TYPE */}

                        <Text
                            className="
text-gray-400
mb-4
font-semibold
"
                        >

                            Type

                        </Text>

                        <View
                            className="
flex-row
flex-wrap
justify-between
mb-7
"
                        >

                            {

                                [
                                    "expense",
                                    "income",
                                    "investment",
                                    "debt",
                                ].map(
                                    (item) => (

                                        <TouchableOpacity
                                            key={item}
                                            onPress={() =>
                                                update(
                                                    "type",
                                                    item
                                                )
                                            }
                                            className={`
w-[48%]
mb-3
py-4
rounded-2xl
${formData.type === item
                                                    ?

                                                    "bg-orange-500"

                                                    :

                                                    "bg-[#F7F7F7]"
                                                }
`}
                                        >

                                            <Text
                                                className={`
text-center
capitalize
font-semibold
${formData.type === item
                                                        ?

                                                        "text-white"

                                                        :

                                                        "text-gray-700"
                                                    }
`}
                                            >

                                                {item}

                                            </Text>

                                        </TouchableOpacity>

                                    )

                                )

                            }

                        </View>


                        {/* INPUTS */}

                        <TextInput
                            placeholder="Category"
                            placeholderTextColor="#A0A0A0"
                            value={formData.category}
                            onChangeText={(v) =>
                                update(
                                    "category",
                                    v
                                )
                            }
                            className="
bg-[#F8F8F8]
rounded-2xl
px-6
py-5
mb-4
"
                        />


                        <TextInput
                            placeholder="Amount"
                            placeholderTextColor="#A0A0A0"
                            keyboardType="numeric"
                            value={formData.amount}
                            onChangeText={(v) =>
                                update(
                                    "amount",
                                    v
                                )
                            }
                            className="
bg-[#F8F8F8]
rounded-2xl
px-6
py-5
mb-4
"
                        />


                        <TextInput
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#A0A0A0"
                            value={formData.date}
                            onChangeText={(v) =>
                                update(
                                    "date",
                                    v
                                )
                            }
                            className="
bg-[#F8F8F8]
rounded-2xl
px-6
py-5
mb-4
"
                        />


                        <TextInput
                            placeholder="Description (optional)"
                            placeholderTextColor="#A0A0A0"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={formData.description}
                            onChangeText={(v) =>
                                update(
                                    "description",
                                    v
                                )
                            }
                            className="
bg-[#F8F8F8]
rounded-2xl
px-6
py-5
h-36
mb-8
"
                        />


                        {/* BUTTON */}

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className="
bg-black
rounded-full
py-5
"
                        >

                            {

                                loading

                                    ?

                                    <ActivityIndicator
                                        color="white"
                                    />

                                    :

                                    <Text
                                        className="
text-center
text-white
font-bold
text-lg
"
                                    >

                                        Save Transaction

                                    </Text>

                            }

                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>

    );

}