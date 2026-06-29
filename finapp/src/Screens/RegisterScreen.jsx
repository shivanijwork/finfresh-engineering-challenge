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
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}  >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >



                <View
                    className="
flex-1 
justify-center
bg-gray-100
px-6
"
                >

                    <View
                        className="
bg-white
rounded-3xl
p-8
"
                    >

                        <Text
                            className="
text-4xl
font-bold
text-center
"
                        >

                            FinFresh

                        </Text>

                        <Text
                            className="
text-center
text-gray-500
mt-2
mb-8
"
                        >

                            Create your account

                        </Text>

                        <TextInput
                            placeholder="Name"
                            value={formData.name}
                            onChangeText={(v) =>
                                handleChange("name", v)
                            }
                            className="
border
rounded-xl
p-4
mb-4
"
                        />

                        <TextInput
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(v) =>
                                handleChange("email", v)
                            }
                            className="
border
rounded-xl
p-4
mb-4
"
                        />

                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(v) =>
                                handleChange(
                                    "password",
                                    v
                                )
                            }
                            className="
border
rounded-xl
p-4
mb-5
"
                        />

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className="
bg-black
rounded-xl
p-4
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
text-white
text-center
font-bold
"
                                    >

                                        Register

                                    </Text>

                            }

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login") }
                        >

                            <Text
                                className="
text-center
mt-6
"
                            >

                                Already have account?

                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>
        </KeyboardAvoidingView>


    );

}