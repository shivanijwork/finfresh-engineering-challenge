import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FormField({
    label,
    hint,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    autoCapitalize = "none",
    returnKeyType,
    onSubmitEditing,
}) {
    const [focused, setFocused] = useState(false);
    const [hide, setHide] = useState(!!secureTextEntry);

    return (
        <View className="mb-5">
            <Text className="text-[13px] font-semibold text-[#6B7280] mb-2 ml-1 tracking-wide">
                {label}
            </Text>

            <View
                className={`flex-row items-center rounded-2xl px-5 border ${
                    focused
                        ? "border-[#30D5FF] bg-white"
                        : "border-[#EAE7E0] bg-[#F6F5F1]"
                }`}
                style={
                    focused
                        ? {
                              shadowColor: "#30D5FF",
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.18,
                              shadowRadius: 10,
                              elevation: 2,
                          }
                        : undefined
                }
            >
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#B4B0A6"
                    secureTextEntry={hide}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="flex-1 py-[18px] text-[16px] text-[#111]"
                />

                {secureTextEntry ? (
                    <TouchableOpacity
                        onPress={() => setHide((h) => !h)}
                        hitSlop={10}
                        className="pl-3"
                    >
                        <Ionicons
                            name={hide ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#9A968C"
                        />
                    </TouchableOpacity>
                ) : null}
            </View>

            {hint ? (
                <Text className="text-[12px] text-[#B4B0A6] mt-2 ml-1">
                    {hint}
                </Text>
            ) : null}
        </View>
    );
}
