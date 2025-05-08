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
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { styles as styles } from "../../src/Styles/Index";
import { LinearGradient } from "expo-linear-gradient";

export default function IndexScreen() {
  const { user, loading } = useAuth();

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
    <View style={styles.container}>
      <View></View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={() => {
            router.push("/createExercise");
          }}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={["#6412DF", "#CDA2FB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 0.9]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonGradientText}>Create New Challange</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
