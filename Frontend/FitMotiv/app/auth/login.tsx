import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import { auth as styles } from "../../src/Styles/auth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<Boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password!");
      return;
    } else {
      if (!validateEmail(email)) {
        Alert.alert("Error", "Invalid email format!");
        return;
      }
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/(tabs)");
    } catch (err: any) {
      console.log(`Error: ${err}`);
      Alert.alert(
        "Login failed",
        "Incorrect email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <MaskedView
          maskElement={
            <Text style={[styles.title, { backgroundColor: "transparent" }]}>
              Let's Begin
            </Text>
          }
        >
          <LinearGradient
            colors={["#EEEEEE", "#BABABA", "#888888"]}
            locations={[0, 0.51, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Text style={[styles.title, { opacity: 0 }]}>Let's Begin</Text>
          </LinearGradient>
        </MaskedView>
      </View>

      <View style={styles.inputs}>
        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.description}>Email</Text>
          <TextInput
            placeholder="Enter your email:"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>
        <View style={{ paddingBottom: 20, justifyContent: "center" }}>
          <Text style={styles.description}>Password</Text>
          <TextInput
            placeholder="Enter password:"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity
            style={{ position: "absolute", marginLeft: 250 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingTop: 140 }}>
        {loading ? (
          <ActivityIndicator size={"large"} color="#6412DF" />
        ) : (
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonGradientText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingTop: 80, alignItems: "center" }}>
        <Text style={{ paddingBottom: 10, color: "#A3A0A0" }}>
          Don't have an account?
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/auth/register")}
          style={styles.opacityButton}
        >
          <Text style={styles.buttonGradientText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
