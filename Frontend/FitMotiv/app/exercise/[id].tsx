import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import useAuth from "@/context/authContext/auth";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "react-native-paper";
import { styles as styles } from "../../src/Styles/exercises";
import {
  PlankIcon,
  PushUpsIc,
  SquatIcon,
} from "@/src/Icons/challengeDetailIcons";
import { WebView } from "react-native-webview";

export default function ExerciseScreen() {
  // const { id, exerciseType } = useLocalSearchParams();
  const id = 532;
  const exerciseType = "plank";
  const progression = 63;
  const exerciseTitle = "Plank 2 min";

  const { user, loading } = useAuth();
  const [time, setTime] = useState(0);

  const CAMERA_TEST_URL = 'https://phenomenal-pony-6a5359.netlify.app/'; 

  // const counter = () => {
  //   setTimeout(() => {
  //     setTime(time + 1)
  //   }, 1000);
  // }

  //   useEffect(() => {
  //   counter();
  // })

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  });

  if (loading) {
    return <ActivityIndicator size="large" color="#9A5CEE" />;
  }

  if (!user) {
    return null;
  }


  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeLeft}>Time left: {time} </Text>
      </View>

      <View style={styles.webViewContainer}>


      <WebView
        source={{ uri: CAMERA_TEST_URL }}
      />
      </View>

      <View style={styles.statExercise}>
        <View style={[styles.ExerciseRow, { marginBottom: 10 }]}>
          <View style={styles.backRoundIconExercise}>
            {exerciseType === "plank" ? (
              <PlankIcon />
            ) : exerciseType === "push-up" ? (
              <PushUpsIc />
            ) : (
              <SquatIcon />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 5, paddingRight: 5 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={styles.ExerciseTitle}>{exerciseTitle}</Text>
              <Text style={styles.procent}>{progression}%</Text>
            </View>
            <ProgressBar
              progress={progression / 100}
              color="#9A5CEE"
              style={{
                height: 15,
                borderRadius: 8,
                backgroundColor: "#e0e0e0",
              }}
            />
          </View>
        </View>
      </View>

            
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={() => {
            router.push('/(tabs)');
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
            <Text style={styles.buttonGradientText}>Go Back</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
}
