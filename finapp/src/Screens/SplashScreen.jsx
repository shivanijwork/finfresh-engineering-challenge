import { useEffect } from "react";

import {
    View,
    Text,
    StatusBar,
} from "react-native";

export default function SplashScreen({
    navigation,
}) {

    useEffect(() => {

        const timer =
            setTimeout(() => {

                navigation.replace(
                    "Home"
                );

            }, 5000);

        return () =>
            clearTimeout(timer);

    }, []);

    return (

        <View
            className="
flex-1
bg-[#040615]
justify-center
items-center
px-8
"
        >

            <StatusBar
                barStyle="light-content"
            />

            {/* Glow */}

            <View
                className="
absolute
w-[260]
h-[260]
rounded-full
bg-cyan-400
opacity-10
"
            />

            {/* Logo */}

            <Text
                className="
text-[#D6A34F]
text-4xl
font-black
tracking-[6px]
"
            >
                FINFRESH
            </Text>

            {/* Badge */}

            <View
                className="
mt-8
bg-[#111827]
px-5
py-2
rounded-full
border
border-white/10
"
            >

                <Text
                    className="
text-[#B3B3B3]
text-xs
text-center
"
                >
                    IIT Madras • Startup India • Nvidia
                </Text>

            </View>

            {/* Hero */}

            <Text
                className="
text-white
text-[46px]
font-black
text-center
mt-10
leading-[54px]
"
            >
                Your Money,
            </Text>

            <Text
                className="
text-[#30D5FF]
text-[46px]
font-black
"
            >
                Reimagined
            </Text>

            {/* Subtitle */}

            <Text
                className="
text-[#9CA3AF]
text-center
mt-8
leading-7
text-base
"
            >
                Track spending, hit goals,
                get AI-powered insights
                and transform your
                relationship with money.
            </Text>

            {/* Footer */}

            <Text
                className="
absolute
bottom-12
text-[#6B7280]
text-center
text-xs
"
            >
                Your AI-powered personal
                finance companion
            </Text>

        </View>

    );

}