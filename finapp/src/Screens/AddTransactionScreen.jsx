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
bg-[#FCFCFA]
"
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <View
                    className="
px-6
pt-14
pb-24
"
                >

                    {/* HEADER */}

                    <View
                        className="
mb-10
"
                    >

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
text-[38px]
font-black
mt-6
text-[#111]
"
                        >

                            Add
                            {"\n"}
                            Transaction

                        </Text>

                        <Text
                            className="
text-gray-500
mt-3
leading-7
"
                        >

                            Track your finances with clarity.

                        </Text>

                    </View>


                    {/* CARD */}

                    <View
                        className="
bg-white
rounded-[34px]
p-7
border
border-[#EFEAE3]
"
                    >

                        <Text
                            className="
text-[#111]
font-bold
mb-5
"
                        >

                            Transaction Type

                        </Text>


                        <View
                            className="
flex-row
flex-wrap
justify-between
mb-8
"
                        >

                            {

                                [
                                    "expense",
                                    "income",
                                    "investment",
                                    "debt"
                                ]

                                    .map((item) => (

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
rounded-[18px]

${formData.type === item

                                                    ?

                                                    "bg-[#30D5FF]"

                                                    :

                                                    "bg-[#F7F7F5]"
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

                                                        "text-[#555]"
                                                    }
`}
                                            >

                                                {item}

                                            </Text>

                                        </TouchableOpacity>

                                    ))

                            }

                        </View>


                        {/* INPUTS */}

                        <Input
                            label="Category"
                            placeholder="Food / Salary / Travel"
                            value={formData.category}
                            onChange={(v) =>
                                update(
                                    "category",
                                    v
                                )}
                        />

                        <Input
                            label="Amount"
                            placeholder="₹ 0"
                            keyboardType="numeric"
                            value={formData.amount}
                            onChange={(v) =>
                                update(
                                    "amount",
                                    v
                                )}
                        />

                        <Input
                            label="Date"
                            placeholder="YYYY-MM-DD"
                            value={formData.date}
                            onChange={(v) =>
                                update(
                                    "date",
                                    v
                                )}
                        />

                        <Input
                            label="Description"
                            placeholder="Optional note"
                            multiline
                            value={formData.description}
                            onChange={(v) =>
                                update(
                                    "description",
                                    v
                                )}
                        />


                        <TouchableOpacity
                            onPress={
                                handleSubmit
                            }
                            disabled={
                                loading
                            }
                            className="
bg-[#111]
rounded-full
py-5
mt-6
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

function Input({
    label,
    placeholder,
    value,
    onChange,
    multiline,
    keyboardType
}) {

    return (

        <View
            className="
mb-5
"
        >

            <Text
                className="
text-gray-500
mb-3
font-semibold
"
            >

                {label}

            </Text>

            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#AAA"
                value={value}
                onChangeText={onChange}
                multiline={multiline}
                keyboardType={keyboardType}
                numberOfLines={
                    multiline
                        ? 5
                        : 1
                }
                textAlignVertical="top"
                className="
bg-[#F7F7F5]
rounded-[20px]
px-6
py-5
border
border-[#EFEAE3]
"
            />

        </View>

    );

}