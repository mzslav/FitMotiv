import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { styles as styles } from "../src/Styles/Index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserToken } from "@/context/authContext/getUserToken";

export default function SettingsScreen() {
  const { user, loading } = useAuth();

  const [exerciseItems, setExerciseItems] = useState<number[]>([]);
  const [nextId, setNextId] = useState(0);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

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

  const handleToken = async () => {

    const token = await getUserToken();

    console.log(token);
  };


  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={handleToken} style={{ marginBottom: 20 }}>
          <Text style={{ color: "white", fontSize: 20 }}> Get Token </Text>
        </TouchableOpacity>
      </View>


      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}
