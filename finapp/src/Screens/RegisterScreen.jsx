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
            className="flex-1 bg-[#FCFCFA]"
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : "height"
            }
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



                    {/* CARD */}

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

                            Create Account

                        </Text>

                        <Text
                            className="
text-gray-500
mt-3
mb-8
leading-7
"
                        >

                            Start tracking your finances
                            with clarity.

                        </Text>



                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor="#999"
                            value={formData.name}
                            onChangeText={(v) =>
                                handleChange(
                                    "name",
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
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={formData.email}
                            onChangeText={(v) =>
                                handleChange(
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
                                handleChange(
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
                                handleSubmit
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

                                        Create Account

                                    </Text>

                            }

                        </TouchableOpacity>



                        <TouchableOpacity

                            className="
mt-8
"

                            onPress={() =>

                                navigation.navigate(
                                    "Login"
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

                                Already have an account?
                                Sign In

                            </Text>

                        </TouchableOpacity>

                    </View>



                    {/* FOOTER */}

                    <View
                        className="
mt-10
items-center
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

                </View>

            </ScrollView>

        </KeyboardAvoidingView>

    );

}