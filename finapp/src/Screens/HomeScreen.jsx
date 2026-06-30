import {
View,
Text,
TouchableOpacity,
StatusBar,
} from "react-native";

import {
useNavigation,
} from "@react-navigation/native";

export default function HomeScreen(){

const navigation =
useNavigation();

return(

<View
className="
flex-1
bg-[#0F172A]
justify-between
px-7
pt-20
pb-10
"
>

<StatusBar
barStyle="light-content"
/>

{/* TOP */}

<View>

<Text
className="
text-orange-500
text-xl
font-bold
mb-6
"
>

FINFRESH

</Text>

<Text
className="
text-white
text-5xl
font-bold
leading-tight
"
>

Track{"\n"}
Save{"\n"}
Grow

</Text>

<Text
className="
text-gray-400
text-lg
mt-6
leading-7
"
>

Build smarter money habits
and understand your
financial health.

</Text>

</View>


{/* CARD */}

<View
className="
bg-white
rounded-[35px]
p-7
"
>

<Text
className="
text-3xl
font-bold
"
>

Your Finance
Companion

</Text>

<Text
className="
text-gray-500
mt-3
text-base
"
>

Track expenses,
measure savings,
and improve your
financial health.

</Text>


<TouchableOpacity
onPress={()=>
navigation.navigate(
"Register"
)
}
className="
bg-orange-500
rounded-2xl
py-5
mt-8
"
>

<Text
className="
text-center
text-white
font-bold
text-lg
"
>

Create Account

</Text>

</TouchableOpacity>


<TouchableOpacity
onPress={()=>
navigation.navigate(
"Login"
)
}
className="
mt-5
"
>

<Text
className="
text-center
text-gray-500
"
>

Already have account?

<Text
className="
text-orange-500
font-semibold
"
>

 Login

</Text>

</Text>

</TouchableOpacity>

</View>

</View>

);

}