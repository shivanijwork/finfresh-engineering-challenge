import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Screens/HomeScreen";
import LoginScreen from "../Screens/LoginScreen";
import SplashScreen from "../Screens/SplashScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import DashboardScreen from "../Screens/DashboardScreen";
import AddTransactionScreen from "../Screens/AddTransactionScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Home'}
        screenOptions={{
          headerShown: false,
        }} >
        <Stack.Screen name={'Splash'} component={SplashScreen} />
        <Stack.Screen name={'Home'} component={HomeScreen} />
        <Stack.Screen name={'Login'} component={LoginScreen} />
        <Stack.Screen name={'Register'} component={RegisterScreen} />
        <Stack.Screen name={'Dashboard'} component={DashboardScreen} />

        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
