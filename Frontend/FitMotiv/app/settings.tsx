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
  import { styles as styles } from "../src/Styles/Index";
  
  export default function SettingsScreen() {
  
      const { user, loading } = useAuth();
  
        const handleLogout = async () => {
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
  
    <View style={styles.container}>
        <View></View>
    <Button title="Log Out" onPress={handleLogout} />
  
    </View>
  
    );
  }
  