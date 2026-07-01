import { createBottomTabNavigator }
from "@react-navigation/bottom-tabs";

import {
Ionicons,
} from "@expo/vector-icons";

import HomeScreen
from "../Screens/HomeScreen";

import DashboardScreen
from "../Screens/DashboardScreen";

import AddTransactionScreen
from "../Screens/AddTransactionScreen";

import ProfileScreen
from "../Screens/ProfileScreen";

import { useSafeAreaInsets }
from "react-native-safe-area-context";

const Tab =
createBottomTabNavigator();

export default function BottomTabs() {

const insets = useSafeAreaInsets();

return (

<Tab.Navigator

screenOptions={({

route,

}) => ({

headerShown:false,

tabBarStyle:{

backgroundColor:"#090B14",

height:70 + insets.bottom,

borderTopWidth:0,

paddingBottom:insets.bottom + 8,

paddingTop:10,

shadowColor:"#000",

shadowOffset:{ width:0, height:-6 },

shadowOpacity:0.12,

shadowRadius:16,

elevation:12,

},

tabBarActiveTintColor:
"#30D5FF",

tabBarInactiveTintColor:
"#8A8F9D",

tabBarLabelStyle:{
fontSize:11,
},

tabBarIcon:
({
color,
})=>{

let icon;

if(
route.name==="Home"
)
icon=
"home";

if(
route.name==="Dashboard"
)
icon=
"grid";

if(
route.name==="Add"
)
icon=
"add-circle";

if(
route.name==="Profile"
)
icon=
"person";

return (

<Ionicons
name={icon}
size={22}
color={color}
/>

);

},

})}

>

<Tab.Screen
name="Home"
component={HomeScreen}
/>

<Tab.Screen
name="Dashboard"
component={DashboardScreen}
/>

<Tab.Screen
name="Add"
component={AddTransactionScreen}
/>

<Tab.Screen
name="Profile"
component={ProfileScreen}
/>

</Tab.Navigator>

);

}