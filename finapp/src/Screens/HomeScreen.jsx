import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";



export default function HomeScreen() {
  
  const navigation = useNavigation();

  const gotoRegisterPage = () => {
    navigation.navigate("Register");
  };
  return (
    <View
     className="bg-green-500 p-6" >
      <Text>FinFresh App</Text>

      <Pressable
        onPress={gotoRegisterPage}
      className="bg-blue-500 p-4 rounded-md mt-4"
      >
        <Text>
          Register gfgfg
        </Text>
      </Pressable>
    </View>
  );
}