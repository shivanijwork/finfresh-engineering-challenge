import {
View,
Text,
TouchableOpacity,
} from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {

const logout =
async()=>{

await AsyncStorage.clear();

};

return(

<View
className="
flex-1
bg-[#FCFCFA]
justify-center
items-center
px-6
"
>

<View
className="
w-24
h-24
rounded-full
bg-[#30D5FF]
justify-center
items-center
"
>

<Text
className="
text-white
text-4xl
font-bold
"
>
S
</Text>

</View>

<Text
className="
text-3xl
font-black
mt-6
"
>

Your Profile

</Text>

<Text
className="
text-gray-500
mt-2
"
>

FinFresh Member

</Text>

<TouchableOpacity
className="
bg-black
px-8
py-4
rounded-full
mt-10
"
onPress={logout}
>

<Text
className="
text-white
font-bold
"
>

Logout

</Text>

</TouchableOpacity>

</View>

);

}