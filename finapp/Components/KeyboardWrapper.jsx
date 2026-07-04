import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

export default function KeyboardWrapper({
    children,
    className = "flex-1 bg-white",
}) {
    return (
        <KeyboardAvoidingView
            className={className}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
