import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Screens/HomeScreen";
import LoginScreen from "../Screens/LoginScreen";
import SplashScreen from "../Screens/SplashScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import DashboardScreen from "../Screens/DashboardScreen";
import AddTransactionScreen from "../Screens/AddTransactionScreen";
import TransactionsScreen from "../Screens/TransactionsScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import EditProfileScreen from "../Screens/EditProfileScreen";
import SecurityScreen from "../Screens/SecurityScreen";
import BudgetGoalsScreen from "../Screens/BudgetGoalsScreen";
import BottomTabs from "./BottomTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{
          headerShown: false,
        }} >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />
        <Stack.Screen name={'Home'} component={HomeScreen} />
        <Stack.Screen name={'Login'} component={LoginScreen} />
        <Stack.Screen name={'Register'} component={RegisterScreen} />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
        />
        <Stack.Screen
          name="Transactions"
          component={TransactionsScreen}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
        />
        <Stack.Screen
          name="Security"
          component={SecurityScreen}
        />
        <Stack.Screen
          name="BudgetGoals"
          component={BudgetGoalsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
