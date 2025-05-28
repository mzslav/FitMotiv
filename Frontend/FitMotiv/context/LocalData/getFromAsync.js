import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Link, router } from "expo-router";

export const getWalletData = async () => {
    try {
        const mnemonic = await AsyncStorage.getItem("Seed-Phrase");
        const address = await AsyncStorage.getItem("Wallet-Address");

        if (address !== null && mnemonic !== null) {
         return { mnemonic, address };
        }else{
            Alert.alert('Error', "Please connect wallet")
            router.push('../(tabs)/wallet')
        }
      } catch (e) {
          Alert.alert("Unexpected Error", "Something went wrong.");
         console.error(e);
      }
}