import { useEffect, useState } from "react";
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

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            const storedToken = await AsyncStorage.getItem("token");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setFormData({
                    name: parsed.name || "",
                    email: parsed.email || "",
                });
            }
            if (storedToken) {
                setToken(storedToken);
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Alert.alert("Error", "Name is required");
            return;
        }
        if (!formData.email.trim()) {
            Alert.alert("Error", "Email is required");
            return;
        }
        if (!token) {
            Alert.alert("Error", "Please sign in again.");
            return;
        }
        setSaving(true);
        try {
            const res = await updateProfile(
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                },
                token,
            );
            const updatedUser = res.data.data.user;
            await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
            Alert.alert("Saved", "Profile details updated.", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.log("SAVE PROFILE ERROR", error?.response ?? error);
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Unable to save profile details.",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardWrapper className="flex-1 bg-[#FCFCFA]">
            <View className="flex-1 px-6 pt-16">
                <Text className="text-3xl font-black text-[#111]">Edit Profile</Text>
                <Text className="text-gray-400 mt-2">Update your name and email.</Text>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator color="#30D5FF" />
                    </View>
                ) : (
                    <View className="mt-10 space-y-5">
                        <View>
                            <Text className="text-gray-500 mb-2">Full Name</Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(text) => handleChange("name", text)}
                                className="bg-white rounded-[24px] px-4 py-4 border border-[#E5E7EB] text-[#111]"
                                placeholder="Your name"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View>
                            <Text className="text-gray-500 mb-2">Email</Text>
                            <TextInput
                                value={formData.email}
                                onChangeText={(text) => handleChange("email", text)}
                                className="bg-white rounded-[24px] px-4 py-4 border border-[#E5E7EB] text-[#111]"
                                placeholder="you@email.com"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={saving}
                            activeOpacity={0.9}
                            style={buttonShadow}
                            className="bg-[#30D5FF] rounded-full py-4"
                        >
                            <Text className="text-center text-white font-bold text-lg">
                                {saving ? "Saving..." : "Save Changes"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardWrapper>
    );
}
