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

  const handleAdd = () => {
    const newItems = [nextId, nextId + 1, nextId + 2];
    setExerciseItems([...exerciseItems, ...newItems]);
    setNextId(nextId + 3);

    console.log(exerciseItems);
  };

  const addItemToArray = (index: number) => [console.log(index)];

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={handleAdd} style={{ marginBottom: 20 }}>
          <Text style={{ color: "white", fontSize: 20 }}> Add</Text>
        </TouchableOpacity>
      </View>

      {exerciseItems.map((item, index) => (
        <View key={item} style={{ marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => addItemToArray(item)}
            style={{ height: 50, width: 50, backgroundColor: "red" }}
          />
          <Text style={{ color: "white" }}>ID: {item}</Text>
        </View>
      ))}

      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}
