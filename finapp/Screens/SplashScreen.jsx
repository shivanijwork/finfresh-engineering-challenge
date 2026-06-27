import { View, Text } from "react-native";
export default function SplashScreen() {
  return (
    <View className="bgred h-full flex items-center justify-center bg-blue-500">
      <Text className="text-white text-2xl font-bold">
         Welcome
      </Text>
    </View>
  );
}