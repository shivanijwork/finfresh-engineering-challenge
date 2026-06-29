import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "../src/Screens/LoginScreen";

export default function Page() {
  return (
    <View  >
      <View >
        <LoginScreen/>
        <Text className="text-green-500" >Hello World</Text>
        <Text >This is the first page of your app.</Text>
      </View>
    </View>
  );
}