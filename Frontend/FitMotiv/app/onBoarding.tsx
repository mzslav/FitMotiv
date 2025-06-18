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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserToken } from "@/context/authContext/getUserToken";
import { auth as styles } from "../src/Styles/auth";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { ChooseIcon, DoExerciseIcon, GetRewardIcon } from "../src/Icons/onBoarding";

export default function OnBoardingScreen() {
  const { user, loading } = useAuth();
  const [screen, setScren] = useState<number>(1);

  const handleNext = () => {
    if (screen == 1) {
      setScren(2);
    } else if (screen == 2) {
      setScren(3);
    } else {
      AsyncStorage.setItem("OnBoarding", "true");
      router.push('/(tabs)')
    }
  };

  return (
    <View style={[styles.container, { justifyContent: "center" }]}>
      {screen == 1 ? (
        <View style={[styles.titleBox, { paddingTop: 0 }]}>
          <MaskedView
            maskElement={
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 32,
                    backgroundColor: "transparent",
                    textAlign: "center",
                  },
                ]}
              >
                Choose a challenge
              </Text>
            }
          >
            <LinearGradient
              colors={["#EEEEEE", "#BABABA", "#888888"]}
              locations={[0, 0.51, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={[styles.title, { opacity: 0 }]}>
                Choose a challenge
              </Text>
            </LinearGradient>
          </MaskedView>

          <ChooseIcon />

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.buttonContainer, { marginTop: 50 }]}
          >
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonGradientText}>NEXT STEP</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : screen == 2 ? (
        <View style={[styles.titleBox, { paddingTop: 0 }]}>
          <MaskedView
            maskElement={
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 32,
                    backgroundColor: "transparent",
                    textAlign: "center",
                  },
                ]}
              >
                Do the exercise
              </Text>
            }
          >
            <LinearGradient
              colors={["#EEEEEE", "#BABABA", "#888888"]}
              locations={[0, 0.51, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={[styles.title, { opacity: 0 }]}>
                Do the exercise
              </Text>
            </LinearGradient>
          </MaskedView>

          <DoExerciseIcon />

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.buttonContainer, { marginTop: 50 }]}
          >
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonGradientText}>NEXT STEP</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.titleBox, { paddingTop: 0 }]}>
          <MaskedView
            maskElement={
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 32,
                    backgroundColor: "transparent",
                    textAlign: "center",
                  },
                ]}
              >
                Get a reward
              </Text>
            }
          >
            <LinearGradient
              colors={["#EEEEEE", "#BABABA", "#888888"]}
              locations={[0, 0.51, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={[styles.title, { opacity: 0 }]}>Get a reward</Text>
            </LinearGradient>
          </MaskedView>

          <GetRewardIcon />

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.buttonContainer, { marginTop: 50 }]}
          >
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonGradientText}>GET START</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
