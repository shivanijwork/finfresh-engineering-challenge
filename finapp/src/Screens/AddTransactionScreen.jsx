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
bg-[#F7F8FA]
"
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <View
                    className="
px-6
py-8
"
                >

                    <Text
                        className="
text-4xl
font-bold
"
                    >

                        Add Transaction

                    </Text>

                    <Text
                        className="
text-gray-500
mt-2
mb-8
"
                    >

                        Track your money

                    </Text>

                    <View
                        className="
bg-white
rounded-[30px]
p-7
"
                    >

                        {/* TYPE */}

                        <Text
                            className="font-semibold mb-3"
                        >

                            Type

                        </Text>

                        <View
                            className="
flex-row
mb-5
"
                        >

                            {

                                [
                                    "expense",
                                    "income",
                                    "investment",
                                    "debt",
                                ]
                                    .map(
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
flex-1
p-4
mr-2
rounded-2xl
${formData.type === item
                                                        ?
                                                        "bg-orange-500"
                                                        :
                                                        "bg-gray-100"
                                                    }
`}
                                            >

                                                <Text
                                                    className={`
text-center
font-semibold
${formData.type === item
                                                            ?
                                                            "text-white"
                                                            :
                                                            "text-black"
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

                        <TextInput
                            placeholder="Category"
                            value={formData.category}
                            onChangeText={(v) =>
                                update(
                                    "category",
                                    v
                                )
                            }
                            className="
bg-gray-100
rounded-2xl
p-5
mb-4
"
                        />

                        <TextInput
                            placeholder="Amount"
                            keyboardType="numeric"
                            value={formData.amount}
                            onChangeText={(v) =>
                                update(
                                    "amount",
                                    v
                                )
                            }
                            className="
bg-gray-100
rounded-2xl
p-5
mb-4
"
                        />

                        <TextInput
                            placeholder="Date (YYYY-MM-DD)"
                            value={formData.date}
                            onChangeText={(v) =>
                                update(
                                    "date",
                                    v
                                )
                            }
                            className="
bg-gray-100
rounded-2xl
p-5
mb-4
"
                        />

                        <TextInput
                            placeholder="Description"
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
bg-gray-100
rounded-2xl
p-5
h-32
mb-6
"
                        />

                        <TouchableOpacity
                            onPress={
                                handleSubmit
                            }
                            disabled={
                                loading
                            }
                            className="
bg-black
rounded-2xl
p-5
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

                                        Add Transaction

                                    </Text>

                            }

                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>

    );

}