import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { styles as prevStyles } from "../src/Styles/Index"; // Import previous styles
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

export default function SettingsScreen() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("Seed-Phrase");
    await AsyncStorage.removeItem("Wallet-Address");
    await signOut(auth);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  return (
    <View style={prevStyles.container}>
      <TouchableOpacity onPress={handleLogout} style={customStyles.buttonContainer}>
        <LinearGradient
          colors={["white", "black"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.9]}
          style={customStyles.buttonGradient}
        >
          <Text style={customStyles.buttonText}>Log Out</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={customStyles.buttonContainer}>
        <LinearGradient
          colors={["#6412DF", "#CDA2FB"]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.9]}
          style={customStyles.buttonGradient}
        >
          <Text style={customStyles.buttonText}>Go Back</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const customStyles = StyleSheet.create({
  buttonContainer: {
    width: "80%", 
    marginVertical: 10,
    borderRadius: 25, 
    overflow: "hidden", 
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25, 
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});