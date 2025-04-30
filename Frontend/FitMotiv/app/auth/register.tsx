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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRe, setPasswordRe] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRe, setShowPasswordRe] = useState(false);

  function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleRegister = async () => {
    if (!email || !password || !passwordRe) {
      Alert.alert("Write email and password");
      return;
    } else {
      if (!validateEmail(email)) {
        Alert.alert("Write correct email");
        return;
      }
      if (password !== passwordRe) {
        Alert.alert("Passwords must be similar");
        return;
      }
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/(tabs)");
    } catch (err: any) {
      console.log(`Error: ${err}`);
      Alert.alert("Registration failed", "User with this email already exist.");
    } finally {
      setLoading(false);
    }

    router.push("/(tabs)");
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
        <View style={{ paddingBottom: 20, justifyContent: "center" }}>
          <Text style={styles.description}>Password</Text>
          <TextInput
            placeholder="Enter password again:"
            value={passwordRe}
            onChangeText={setPasswordRe}
            secureTextEntry={!showPasswordRe}
            style={styles.input}
          />
          <TouchableOpacity
            style={{ position: "absolute", marginLeft: 250 }}
            onPress={() => setShowPasswordRe(!showPasswordRe)}
          >
            <Text>{showPasswordRe ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingTop: 50 }}>
        {loading ? (
          <ActivityIndicator size={"large"} color="#6412DF" />
        ) : (
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonGradientText}>Register</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingTop: 80, alignItems: "center" }}>
        <Text style={{ paddingBottom: 10, color: "#A3A0A0" }}>
          Already have an account?
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          style={styles.opacityButton}
        >
          <Text style={styles.buttonGradientText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
