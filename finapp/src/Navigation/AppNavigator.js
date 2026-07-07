import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

// Root screens — no back button
const rootOptions = { headerShown: false };

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={({ navigation }) => ({
          // Transparent header overlaying each screen, showing only a back icon
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "transparent" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              accessibilityLabel="Go back"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ paddingVertical: 4, paddingRight: 8 }}
            >
              <Ionicons name="chevron-back" size={26} color="#111" />
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={rootOptions}
        />
        <Stack.Screen name={'Home'} component={HomeScreen} options={rootOptions} />
        <Stack.Screen name={'Login'} component={LoginScreen} />
        <Stack.Screen name={'Register'} component={RegisterScreen} />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={rootOptions}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
        />
        <Stack.Screen
          name="Transactions"
          component={TransactionsScreen}
        />
        {/* These screens already render their own back button */}
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={rootOptions}
        />
        <Stack.Screen
          name="Security"
          component={SecurityScreen}
          options={rootOptions}
        />
        <Stack.Screen
          name="BudgetGoals"
          component={BudgetGoalsScreen}
          options={rootOptions}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
