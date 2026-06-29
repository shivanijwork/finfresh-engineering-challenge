import { View, Text } from "react-native";
import './style/global.css';
import AppNavigator from "./src/Navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider >
      <AppNavigator /> 
    </SafeAreaProvider>
  );
}