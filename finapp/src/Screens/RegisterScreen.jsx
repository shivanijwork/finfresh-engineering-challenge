import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../services/api";

export default function RegisterScreen() {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (key, value) => {

        setFormData({
            ...formData,
            [key]: value,
        });

    };

    const validate = () => {

        if (!formData.name.trim()) {
            Alert.alert("Error", "Name required");
            return false;
        }

        if (!formData.email.trim()) {
            Alert.alert("Error", "Email required");
            return false;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(formData.email)
        ) {
            Alert.alert("Error", "Invalid email");
            return false;
        }

        if (formData.password.length < 6) {
            Alert.alert(
                "Error",
                "Password must be at least 6 chars"
            );

            return false;
        }

        return true;

    };

    const handleSubmit = async () => {

        if (!validate()) return;

        try {

            setLoading(true);

            const res =
                await registerUser(formData);

            console.log(
                "REGISTER",
                res.data
            );

            Alert.alert(
                "Success",
                "Registered successfully",
                [
                    {
                        text: "Login",
                        onPress: () => {
                            navigation.navigate("Login", {
                                email: formData.email,
                            });
                        },
                    },
                ]
            );

        }
        catch (error) {

            console.log(
                "REGISTER ERROR",
                error?.response?.data
            );

            Alert.alert(
                "Error",
                error?.response?.data?.message
                ||
                "Registration failed"
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <KeyboardAvoidingView
            className="flex-1 bg-[#F5F8F3]"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
                keyboardShouldPersistTaps="handled"
            >

                <View
                    className="
px-7
py-10
"
                >

                    {/* Logo */}

                    <View
                        className="
items-center
mb-10
"
                    >

                        <View
                            className="
w-24
h-24
rounded-full
bg-orange-500
justify-center
items-center
mb-4
shadow
"
                        >

                            <Text
                                className="
text-white
text-4xl
font-bold
"
                            >
                                ₹
                            </Text>

                        </View>

                        <Text
                            className="
text-4xl
font-extrabold
text-[#233420]
"
                        >
                            FinFresh
                        </Text>

                        <Text
                            className="
text-[#7C8A77]
mt-2
text-center
"
                        >
                            Start your smart finance journey
                        </Text>

                    </View>


                    {/* Form Card */}

                    <View
                        className="
bg-white
rounded-[32px]
p-8
shadow
"
                    >

                        <Text
                            className="
text-3xl
font-bold
text-[#233420]
mb-2
"
                        >

                            Create Account

                        </Text>

                        <Text
                            className="
text-[#889282]
mb-8
"
                        >

                            Track • Save • Grow

                        </Text>


                        {/* Name */}

                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor="#A0A0A0"
                            value={formData.name}
                            onChangeText={(v) =>
                                handleChange(
                                    "name",
                                    v
                                )
                            }
                            className="
bg-[#F5F8F3]
rounded-2xl
p-5
mb-4
"
                        />


                        {/* Email */}

                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#A0A0A0"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(v) =>
                                handleChange(
                                    "email",
                                    v
                                )
                            }
                            className="
bg-[#F5F8F3]
rounded-2xl
p-5
mb-4
"
                        />


                        {/* Password */}

                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#A0A0A0"
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(v) =>
                                handleChange(
                                    "password",
                                    v
                                )
                            }
                            className="
bg-[#F5F8F3]
rounded-2xl
p-5
mb-6
"
                        />


                        {/* Register Button */}

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className="
bg-orange-500
rounded-2xl
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

                                        Create Account

                                    </Text>

                            }

                        </TouchableOpacity>


                        {/* Login */}

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate(
                                    "Login"
                                )
                            }
                        >

                            <Text
                                className="
text-center
mt-7
text-[#7C8A77]
"
                            >

                                Already have an account?

                                <Text
                                    className="
text-orange-500
font-bold
"
                                >

                                    Login

                                </Text>

                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>

        </KeyboardAvoidingView>

    );

}