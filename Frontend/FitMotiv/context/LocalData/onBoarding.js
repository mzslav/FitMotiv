import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Link, router } from "expo-router";

export const getOnBoardingStatus = async () => {
  try {
    const onBoarding = await AsyncStorage.getItem("OnBoarding");

    if (onBoarding !== null) {
      router.push("../(tabs)");
    } else {
      router.push('../onBoarding');
    }
  } catch (e) {
    Alert.alert("Unexpected Error", "Something went wrong.");
    console.error(e);
  }
};
