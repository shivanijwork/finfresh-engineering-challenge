import { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
} from "react-native";

import {
    useNavigation,
} from "@react-navigation/native";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import {
    loginUser,
} from "../services/api";

export default function LoginScreen() {

    const navigation =
        useNavigation();

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            email: "",
            password: "",
        });

    const updateField =
        (key, value) => {

            setFormData(
                prev => ({
                    ...prev,
                    [key]: value,
                })
            );

        };

    const handleLogin =
        async () => {

            if (
                !formData.email.trim()
                ||
                !formData.password
            ) {

                Alert.alert(
                    "Error",
                    "Fill all fields"
                );

                return;

            }

            try {

                setLoading(true);

                const res =
                    await loginUser({
                        email:
                            formData.email.trim(),
                        password:
                            formData.password,
                    });

                console.log(
                    "LOGIN RESPONSE",
                    JSON.stringify(
                        res.data,
                        null,
                        2
                    )
                );

                await AsyncStorage.setItem(
                    "token",
                    res.data.data.token
                );

                await AsyncStorage.setItem(
                    "user",
                    JSON.stringify(
                        res.data.data.user
                    )
                );

                Alert.alert(
                    "Success",
                    "Login successful"
                );

                // navigation.navigate(
                // "Dashboard"
                // );
                navigation.replace(
                    "Main"
                )

            }

            catch (error) {

                console.log(
                    "LOGIN ERROR",
                    JSON.stringify(
                        error?.response?.data,
                        null,
                        2
                    )
                );

                Alert.alert(
                    "Login Failed",
                    error?.response?.data?.message
                    ||
                    "Invalid credentials"
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
                contentContainerStyle={{
                    flexGrow: 1
                }}
                keyboardShouldPersistTaps="handled"
            >

                <View
                    className="
flex-1
px-6
pt-16
pb-10
"
                >

                    {/* HEADER */}

                    <View>

                        <Text
                            className="
text-4xl
font-black
text-[#D6A34F]
"
                        >

                            FINFRESH

                        </Text>

                        <Text
                            className="
text-gray-400
mt-2
"
                        >

                            Your Finance Companion

                        </Text>

                    </View>



                    {/* LOGIN CARD */}

                    <View
                        className="
bg-white
rounded-[36px]
p-8
mt-14
border
border-[#EFEAE3]
"
                    >

                        <Text
                            className="
text-3xl
font-black
text-[#111]
"
                        >

                            Welcome Back

                        </Text>


                        <Text
                            className="
text-gray-500
mt-3
mb-8
leading-7
"
                        >

                            Sign in to continue
                            tracking your finances.

                        </Text>



                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={
                                formData.email
                            }
                            onChangeText={(v) =>

                                updateField(
                                    "email",
                                    v
                                )

                            }
                            className="
bg-[#FAFAFA]
rounded-2xl
p-5
mb-4
text-[#111]
"
                        />



                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={
                                formData.password
                            }
                            onChangeText={(v) =>

                                updateField(
                                    "password",
                                    v
                                )

                            }
                            className="
bg-[#FAFAFA]
rounded-2xl
p-5
mb-6
text-[#111]
"
                        />



                        <TouchableOpacity

                            onPress={
                                handleLogin
                            }

                            disabled={
                                loading
                            }

                            className="
bg-[#30D5FF]
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

                                        Login

                                    </Text>

                            }

                        </TouchableOpacity>



                        <TouchableOpacity

                            className="
mt-8
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
text-[#111]
font-semibold
"
                            >

                                Don't have an account?
                                {" "}
                                Create one

                            </Text>

                        </TouchableOpacity>

                    </View>



                    {/* FOOTER */}

                    <View
                        className="
items-center
mt-10
"
                    >

                        <Text
                            className="
text-gray-400
"
                        >

                            Secure • Private • Simple

                        </Text>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>

    );

}