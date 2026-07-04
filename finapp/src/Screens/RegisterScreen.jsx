import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { registerUser } from "../services/api";
import KeyboardWrapper from "../../Components/KeyboardWrapper";
import FormField from "../../Components/FormField";
import { buttonShadow } from "../theme/theme";

export default function RegisterScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (key, value) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const validate = () => {
        if (!formData.name.trim()) {
            Alert.alert("Error", "Name required");
            return false;
        }
        if (!formData.email.trim()) {
            Alert.alert("Error", "Email required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            Alert.alert("Error", "Invalid email");
            return false;
        }
        if (formData.password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 chars");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const res = await registerUser(formData);
            console.log("REGISTER", res.data);
            Alert.alert("Success", "Account created", [
                {
                    text: "Sign in",
                    onPress: () =>
                        navigation.navigate("Login", {
                            email: formData.email,
                        }),
                },
            ]);
        } catch (error) {
            console.log("REGISTER ERROR", error);
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Registration failed",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardWrapper className="flex-1 bg-[#FCFCFA]">
            <View
                className="flex-1 px-7 pb-10"
                style={{ paddingTop: insets.top + 20 }}
            >
                {/* BRAND EYEBROW */}
                <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-[#30D5FF] mr-2" />
                    <Text className="text-[13px] font-bold text-[#D6A34F] tracking-[3px]">
                        FINFRESH
                    </Text>
                </View>

                {/* HEADLINE */}
                <Text className="text-[40px] font-black text-[#111] leading-[46px] mt-9">
                    Create{"\n"}account
                </Text>
                <Text className="text-[16px] text-[#6B7280] leading-7 mt-4 pr-6">
                    A calm, private place to track where your money goes.
                </Text>

                {/* FORM */}
                <View className="mt-10">
                    <FormField
                        label="FULL NAME"
                        placeholder="Naveen Kumar"
                        autoCapitalize="words"
                        value={formData.name}
                        onChangeText={(v) => handleChange("name", v)}
                    />
                    <FormField
                        label="EMAIL"
                        placeholder="you@email.com"
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(v) => handleChange("email", v)}
                    />
                    <FormField
                        label="PASSWORD"
                        placeholder="••••••••"
                        secureTextEntry
                        hint="At least 6 characters"
                        value={formData.password}
                        onChangeText={(v) => handleChange("password", v)}
                    />

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.9}
                        style={buttonShadow}
                        className="bg-[#30D5FF] rounded-2xl py-[18px] mt-3"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-center text-white font-bold text-[17px]">
                                Create account
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* FOOTER */}
                <View className="mt-auto pt-10 items-center">
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        hitSlop={8}
                    >
                        <Text className="text-[15px] text-[#6B7280]">
                            Already have an account?{" "}
                            <Text className="text-[#111] font-bold">Sign in</Text>
                        </Text>
                    </TouchableOpacity>

                    <Text className="text-[12px] text-[#B4B0A6] mt-5">
                        Your data stays yours.
                    </Text>
                </View>
            </View>
        </KeyboardWrapper>
    );
}
