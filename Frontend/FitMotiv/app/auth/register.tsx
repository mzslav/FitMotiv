import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { auth as styles } from "../../src/Styles/auth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
  const router = useRouter();

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
          <TextInput placeholder="Enter your email:" style={styles.input} />
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.description}>Password</Text>
          <TextInput placeholder="Enter password:" style={styles.input} />
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.description}>Password</Text>
          <TextInput placeholder="Enter password again:" style={styles.input} />
        </View>
      </View>

      <View style={{ paddingTop: 50 }}>
        <TouchableOpacity
          onPress={() => router.push("/wallet")}
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
