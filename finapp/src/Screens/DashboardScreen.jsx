import { useEffect, useState } from "react";

import {
View,
Text,
ScrollView,
ActivityIndicator,
TouchableOpacity,
Alert,
} from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import {
getSummary,
getFinancialHealth,
} from "../services/api";

export default function DashboardScreen(){

const [loading,setLoading]=
useState(true);

const [summary,setSummary]=
useState(null);

const [
financialHealth,
setFinancialHealth
]=useState(null);

const fetchData=async()=>{

try{

const token=
await AsyncStorage.getItem(
"token"
);

if(!token){

Alert.alert(
"Error",
"Please login again"
);

return;

}

const summaryRes=
await getSummary(
token
);

const healthRes=
await getFinancialHealth(
token
);

setSummary(
summaryRes.data.data
);

setFinancialHealth(
healthRes.data.data
);

}
catch(error){

console.log(error);

Alert.alert(
"Error",
error?.response?.data?.message
||
"Dashboard load failed"
);

}
finally{

setLoading(false);

}

};

useEffect(()=>{

fetchData();

},[]);

if(loading){

return(

<View
className="
flex-1
justify-center
items-center
bg-[#F7F8FA]
"
>

<ActivityIndicator
size="large"
color="#f97316"
/>

<Text
className="mt-3"
>

Loading Dashboard...

</Text>

</View>

);

}

return(

<ScrollView
className="
flex-1
bg-[#F7F8FA]
"
showsVerticalScrollIndicator={false}
>

<View
className="p-6"
>

{/* HEADER */}

<Text
className="
text-4xl
font-bold
"
>

Dashboard

</Text>

<Text
className="
text-gray-500
mt-2
mb-7
"
>

Track your finances

</Text>

{/* CARDS */}

<View
className="gap-4"
>

<Card
title="Income"
value={`₹${summary?.income||0}`}
color="text-green-600"
/>

<Card
title="Expense"
value={`₹${summary?.expense||0}`}
color="text-red-500"
/>

<Card
title="Savings"
value={`₹${summary?.savings||0}`}
subtitle={`Rate: ${summary?.savingsRate||0}%`}
/>

<Card
title="Health Score"
value={
financialHealth?.score
||
0
}
subtitle={
financialHealth?.category
}
color="text-orange-500"
/>

</View>

{/* CATEGORY */}

<View
className="
bg-white
rounded-3xl
p-5
mt-7
"
>

<Text
className="
text-xl
font-bold
mb-5
"
>

Categories

</Text>

{

summary?.categories
&&

Object.entries(
summary.categories
).map(
([key,value])=>(

<View
key={key}
className="
flex-row
justify-between
py-3
border-b
border-gray-100
"
>

<Text>

{key}

</Text>

<Text
className="font-semibold"
>

₹{value}

</Text>

</View>

)

)

}

</View>

{/* SUGGESTIONS */}

<View
className="
bg-white
rounded-3xl
p-5
mt-6
mb-10
"
>

<Text
className="
text-xl
font-bold
mb-5
"
>

Suggestions

</Text>

{

financialHealth
?.suggestions
?.length

?

financialHealth
.suggestions
.map(
(item,index)=>(

<View
key={index}
className="
bg-orange-50
rounded-2xl
p-4
mb-3
"
>

<Text>

{item}

</Text>

</View>

)
)

:

<Text
className="text-gray-400"
>

No suggestions

</Text>

}

</View>

<TouchableOpacity
className="
bg-black
rounded-2xl
p-5
mb-8
"
>

<Text
className="
text-white
text-center
font-bold
"
>

+ Add Transaction

</Text>

</TouchableOpacity>

</View>

</ScrollView>

);

}

function Card({
title,
value,
subtitle,
color="text-black",
}){

return(

<View
className="
bg-white
rounded-3xl
p-6
"
>

<Text
className="text-gray-500"
>

{title}

</Text>

<Text
className={`
text-3xl
font-bold
mt-3
${color}
`}
>

{value}

</Text>

{

subtitle

&&

<Text
className="
text-gray-400
mt-2
"
>

{subtitle}

</Text>

}

</View>

);

}