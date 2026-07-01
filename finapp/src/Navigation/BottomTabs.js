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

const Tab =
createBottomTabNavigator();

export default function BottomTabs() {

return (

<Tab.Navigator

screenOptions={({

route,

}) => ({

headerShown:false,

tabBarStyle:{

backgroundColor:"#090B14",

height:80,

borderTopWidth:0,

paddingBottom:12,

paddingTop:10,

},

tabBarActiveTintColor:
"#2FE6D2",

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