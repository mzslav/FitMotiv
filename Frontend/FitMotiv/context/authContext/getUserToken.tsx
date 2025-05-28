import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem("UserToken");
    return token;
  } catch (error) {
    console.log("Error while get uid:", error);
    return null;
  }
};