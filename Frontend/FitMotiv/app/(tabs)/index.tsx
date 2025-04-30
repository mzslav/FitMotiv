import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
export default function Index() {


  const handleLogout = async () => {
    await signOut(auth)
  }

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

  return <Button title="Log Out" onPress={handleLogout} />;
}
