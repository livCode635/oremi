import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import Notfound from "./+not-found";
import TabsNavigation from "./Screens/TabsNavigation/_layout";
import AI from "./Screens/TabsNavigation/HomeScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  return (
    <>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }} 
        initialRouteName="HomeScreen"
      >
        {/* App Screens */}
        <Stack.Screen name="HomeScreen" component={TabsNavigation} />
        {/* <Stack.Screen name="AiScreen" component={AI} /> */}
        
        {/* Common */}
        <Stack.Screen name="Notfound" component={Notfound} />
      </Stack.Navigator>
    </>
  );
};

export default function Index() {
  return (
    <AppNavigator />
  );
}