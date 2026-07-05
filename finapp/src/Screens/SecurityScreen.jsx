import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { updateProfile } from "../services/api";
import KeyboardWrapper from "../../Components/KeyboardWrapper";
import { buttonShadow } from "../theme/theme";

export default function SecurityScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSave = async () => {
        if (!password || !confirmPassword) {
            Alert.alert("Error", "Both fields are required.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "Please sign in again.");
                return;
            }
            const res = await updateProfile(
                { password },
                token,
            );
            const updatedUser = res.data.data.user;
            if (updatedUser) {
                await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
            }
            Alert.alert("Saved", "Password updated successfully.", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.log("SECURITY SAVE ERROR", error?.response ?? error);
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Unable to update password.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardWrapper className="flex-1 bg-[#FCFCFA]">
            <View className="flex-1 px-6 pt-16">
                <Text className="text-3xl font-black text-[#111]">Security</Text>
                <Text className="text-gray-400 mt-2">Update your password and keep your account safe.</Text>

                <View className="mt-10 space-y-5">
                    <View>
                        <Text className="text-gray-500 mb-2">New Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            className="bg-white rounded-[24px] px-4 py-4 border border-[#E5E7EB] text-[#111]"
                            placeholder="New password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                        />
                    </View>
                    <View>
                        <Text className="text-gray-500 mb-2">Confirm Password</Text>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            className="bg-white rounded-[24px] px-4 py-4 border border-[#E5E7EB] text-[#111]"
                            placeholder="Confirm password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        activeOpacity={0.9}
                        style={buttonShadow}
                        className="bg-[#111] rounded-full py-4"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-center text-white font-bold text-lg">
                                Save Password
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardWrapper>
    );
}
