import { useEffect, useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import {
    useNavigation,
} from "@react-navigation/native";

import {
    cardShadow,
    darkButtonShadow,
} from "../theme/theme";

export default function ProfileScreen() {

    const navigation = useNavigation();

    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            const stored =
                await AsyncStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        })();
    }, []);

    const logout = async () => {
        await AsyncStorage.clear();
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    };

    const name = user?.name || "FinFresh User";
    const email = user?.email || "FinFresh Member";
    const initial = name?.[0]?.toUpperCase() || "U";

    return (

        <View
            className="
flex-1
bg-[#FCFCFA]
justify-center
px-6
"
        >

            {/* PROFILE CARD */}

            <View
                style={cardShadow}
                className="
bg-white
rounded-[36px]
p-8
items-center
border
border-[#EFEAE3]
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
font-black
"
                    >
                        {initial}
                    </Text>

                </View>

                <Text
                    className="
text-2xl
font-black
mt-6
text-[#111]
"
                >
                    {name}
                </Text>

                <Text
                    className="
text-gray-500
mt-2
"
                >
                    {email}
                </Text>

                <TouchableOpacity
                    style={darkButtonShadow}
                    className="
bg-[#111]
w-full
py-5
rounded-full
mt-10
"
                    onPress={logout}
                >

                    <Text
                        className="
text-white
font-bold
text-center
text-lg
"
                    >
                        Logout
                    </Text>

                </TouchableOpacity>

            </View>

        </View>

    );

}
