import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loginUser } from "../services/api";
import KeyboardWrapper from "../../Components/KeyboardWrapper";
import FormField from "../../Components/FormField";
import { buttonShadow } from "../theme/theme";

export default function LoginScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: route?.params?.email || "",
        password: "",
    });

    const updateField = (key, value) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const handleLogin = async () => {
        if (!formData.email.trim() || !formData.password) {
            Alert.alert("Error", "Fill all fields");
            return;
        }
        try {
            setLoading(true);
            const res = await loginUser({
                email: formData.email.trim(),
                password: formData.password,
            });
            await AsyncStorage.setItem("token", res.data.data.token);
            await AsyncStorage.setItem(
                "user",
                JSON.stringify(res.data.data.user),
            );
            navigation.replace("Main");
        } catch (error) {
            console.log(
                "LOGIN ERROR",
                JSON.stringify(error?.response?.data, null, 2),
            );
            Alert.alert(
                "Login failed",
                error?.response?.data?.message || "Invalid credentials",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardWrapper className="flex-1 bg-[#FCFCFA]">
            <View
                className="flex-1 px-6 pb-10"
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
                    Welcome{"\n"}back
                </Text>
                <Text className="text-[16px] text-[#6B7280] leading-7 mt-4 pr-6">
                    Sign in to pick up where your finances left off.
                </Text>

                {/* FORM */}
                <View className="mt-10">
                    <FormField
                        label="EMAIL"
                        placeholder="you@email.com"
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(v) => updateField("email", v)}
                    />
                    <FormField
                        label="PASSWORD"
                        placeholder="••••••••"
                        secureTextEntry
                        value={formData.password}
                        onChangeText={(v) => updateField("password", v)}
                    />

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.9}
                        style={buttonShadow}
                        className="bg-[#30D5FF] rounded-2xl py-[18px] mt-3"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-center text-white font-bold text-[17px]">
                                Sign in
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* FOOTER */}
                <View className="mt-auto pt-10 items-center">
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                        hitSlop={8}
                    >
                        <Text className="text-[15px] text-[#6B7280]">
                            New to FinFresh?{" "}
                            <Text className="text-[#111] font-bold">
                                Create account
                            </Text>
                        </Text>
                    </TouchableOpacity>

                    <Text className="text-[12px] text-[#B4B0A6] mt-5">
                        Secure · Private · Simple
                    </Text>
                </View>
            </View>
        </KeyboardWrapper>
    );
}
