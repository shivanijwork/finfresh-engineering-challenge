import { useState } from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
Alert,
ActivityIndicator,
SafeAreaView,
ScrollView,
} from "react-native";

import {
useNavigation,
} from "@react-navigation/native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import {
loginUser,
} from "../services/api";

export default function LoginScreen() {

const navigation =
useNavigation();

const [loading,setLoading]=
useState(false);

const [formData,setFormData]=
useState({
email:"",
password:"",
});

const updateField=
(key,value)=>{

setFormData(
prev=>({
...prev,
[key]:value,
})
);

};

const handleLogin=
async()=>{

if(
!formData.email.trim()
||
!formData.password
){

Alert.alert(
"Error",
"Fill all fields"
);

return;

}

try{

setLoading(true);

const res=
await loginUser({
email:
formData.email.trim(),
password:
formData.password,
});

console.log(
"LOGIN RESPONSE",
JSON.stringify(
res.data,
null,
2
)
);

await AsyncStorage.setItem(
"token",
res.data.data.token
);

await AsyncStorage.setItem(
"user",
JSON.stringify(
res.data.data.user
)
);

Alert.alert(
"Success",
"Login successful"
);

navigation.reset({
index:0,
routes:[
{
name:
"Dashboard"
}
]
});

}

catch(error){

console.log(
"LOGIN ERROR",
JSON.stringify(
error?.response?.data,
null,
2
)
);

Alert.alert(
"Login Failed",
error?.response?.data?.message
||
"Invalid credentials"
);

}

finally{

setLoading(false);

}

};

return(

<SafeAreaView
className="
flex-1
bg-[#F7F8FA]
"
>

<ScrollView
contentContainerStyle={{
flexGrow:1,
justifyContent:
"center",
}}
keyboardShouldPersistTaps=
"handled"
>

<View
className="
px-7
"
>

{/* Header */}

<View
className="
items-center
mb-10
"
>

<View
className="
w-20
h-20
rounded-full
bg-orange-500
items-center
justify-center
mb-4
"
>

<Text
className="
text-white
text-3xl
font-bold
"
>

₹

</Text>

</View>

<Text
className="
text-4xl
font-bold
"
>

FinFresh

</Text>

<Text
className="
text-gray-500
mt-2
"
>

Track • Save • Grow

</Text>

</View>

{/* Card */}

<View
className="
bg-white
rounded-[30px]
p-8
shadow
"
>

<Text
className="
text-3xl
font-bold
mb-2
"
>

Welcome Back

</Text>

<Text
className="
text-gray-500
mb-7
"
>

Login to continue

</Text>

<TextInput
placeholder="Email"
autoCapitalize="none"
keyboardType="email-address"
value={
formData.email
}
onChangeText={
(v)=>
updateField(
"email",
v
)
}
className="
bg-gray-100
rounded-2xl
p-5
mb-4
"
/>

<TextInput
placeholder="Password"
secureTextEntry
value={
formData.password
}
onChangeText={
(v)=>
updateField(
"password",
v
)
}
className="
bg-gray-100
rounded-2xl
p-5
mb-6
"
/>

<TouchableOpacity
onPress={
handleLogin
}
disabled={
loading
}
className="
bg-orange-500
rounded-2xl
py-5
"
>

{
loading

?

<ActivityIndicator
color=
"white"
/>

:

<Text
className="
text-white
text-center
font-bold
text-lg
"
>

Login

</Text>

}

</TouchableOpacity>

<TouchableOpacity
onPress={()=>
navigation.navigate(
"Register"
)
}
>

<Text
className="
text-center
mt-6
text-gray-500
"
>

Don't have an account?

<Text
className="
text-orange-500
font-semibold
"
>

 Register

</Text>

</Text>

</TouchableOpacity>

</View>

</View>

</ScrollView>

</SafeAreaView>

);

}