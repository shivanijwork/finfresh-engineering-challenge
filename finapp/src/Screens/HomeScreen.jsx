import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import {
    useNavigation,
} from "@react-navigation/native";

import {
    useEffect,
    useState,
} from "react";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

export default function HomeScreen() {

    const navigation = useNavigation();

    const [user, setUser] =
        useState(null);

    useEffect(() => {

        loadUser();

    }, []);

    const loadUser =
        async () => {

            const storedUser =
                await AsyncStorage.getItem(
                    "user"
                );

            if (storedUser) {

                setUser(
                    JSON.parse(
                        storedUser
                    )
                );

            }

        };

    return (

        <ScrollView
            className="flex-1 bg-[#FCFCFA]"
            showsVerticalScrollIndicator={false}
        >

            {/* HEADER */}

            <View
                className="
px-6
pt-16
flex-row
justify-between
items-center
"
            >

                <View>

                    <Text
                        className="
text-3xl
font-black
text-[#D6A34F]
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
                        Your Finance Companion
                    </Text>

                </View>

                {

                    user ?

                        (

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "Profile"
                                    )
                                }
                                className="
w-11
h-11
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
text-lg
"
                                >

                                    {
                                        user?.name?.[0]
                                        ||
                                        "U"
                                    }

                                </Text>

                            </TouchableOpacity>

                        )

                        :

                        (

                            <View className="flex-row gap-3">

                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(
                                            "Login"
                                        )
                                    }
                                >

                                    <Text
                                        className="
text-[#111]
font-semibold
mt-3
"
                                    >

                                        Login

                                    </Text>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="
bg-[#111]
px-5
py-3
rounded-full
"
                                    onPress={() =>
                                        navigation.navigate(
                                            "Register"
                                        )
                                    }
                                >

                                    <Text
                                        className="
text-white
font-bold
"
                                    >

                                        Sign Up

                                    </Text>

                                </TouchableOpacity>

                            </View>

                        )

                }

            </View>


            {/* HERO */}

            <View
                className="
px-6
mt-16
"
            >

                <View
                    className="
self-start
bg-[#30D5FF]
rounded-full
px-4
py-2
mb-6
"
                >

                    <Text
                        className="
text-white
font-semibold
"
                    >
                        IIT Madras Incubated
                    </Text>

                </View>


                <Text
                    className="
text-[48px]
font-black
leading-[56px]
text-[#111]
"
                >
                    Your Money,
                    {"\n"}
                    Reimagined
                </Text>


                <Text
                    className="
text-[17px]
leading-8
text-gray-500
mt-6
"
                >
                    Track spending, understand habits,
                    and view intelligent financial insights.
                </Text>


                <TouchableOpacity
                    className="
bg-[#30D5FF]
rounded-full
mt-10
py-5
"
                    onPress={() =>
                        navigation.navigate(
                            "Register"
                        )
                    }
                >

                    <Text
                        className="
text-center
text-white
font-bold
text-lg
"
                    >
                        Get Started
                    </Text>

                </TouchableOpacity>

            </View>


            {/* FEATURES */}

            {/* FEATURES */}

            <View
                className="
px-6
mt-20
"
            >

                <Text
                    className="
text-2xl
font-black
mb-8
text-[#111]
"
                >

                    Everything you need

                </Text>

                {
                    [
                        {
                            number: "01",
                            title: "Smart Dashboard",
                            desc: "See income, expenses and savings in one place."
                        },

                        {
                            number: "02",
                            title: "Financial Health",
                            desc: "Understand your financial position instantly."
                        },

                        {
                            number: "03",
                            title: "Personal Insights",
                            desc: "Simple insights from your financial activity."
                        },

                        {
                            number: "04",
                            title: "Expense Tracking",
                            desc: "Track every transaction effortlessly."
                        },

                    ].map((item, index) => (

                        <View
                            key={index}
                            className="
bg-white
rounded-[32px]
p-7
mb-5
border
border-[#EFEAE3]
"
                        >

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
font-black
"
                                >

                                    {item.number}

                                </Text>

                            </View>


                            <Text
                                className="
text-[22px]
font-bold
mt-5
text-[#111]
"
                            >

                                {item.title}

                            </Text>


                            <Text
                                className="
text-gray-500
leading-7
mt-3
"
                            >

                                {item.desc}

                            </Text>

                        </View>

                    ))
                }

            </View>


            {/* FOOTER */}

            <View
                className="
items-center
mt-10
mb-16
"
            >

                <Text
                    className="
text-gray-400
"
                >
                    Your data stays yours.
                </Text>

            </View>

        </ScrollView>

    );

}