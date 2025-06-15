import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "react-native-paper";
import { styles as styles } from "../../src/Styles/exercises";
import { getUserToken } from "@/context/authContext/getUserToken";
import {
  PlankIcon,
  PushUpsIc,
  SquatIcon,
} from "@/src/Icons/challengeDetailIcons";
import { WebView } from "react-native-webview";
import { Camera } from "expo-camera";
import { completeChallenge } from "@/Web3Module/contract/challegeHandler";
import LoadingScreen from "@/context/LoadingBoard/Loading";

export default function ExerciseScreen() {
  const { user, loading } = useAuth();
  const { challenge_id, id } = useLocalSearchParams();
  const [exerciseType, setExerciseType] = useState<string>("");
  const [progression, setProgression] = useState<number>(0);
  const [exerciseTitle, setExerciseTitle] = useState<string>("");
  const [repetitions, setRepetitions] = useState<number>(0);
  const [mode, setMode] = useState<string>("");
  const [inProgress, setInProgress] = useState<boolean>(false);

  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  const fetchChallengeData = async () => {
    try {
      const token = await getUserToken();
      const url = `${process.env.EXPO_PUBLIC_SERVER_HOST}/exercise/getExerciseData?challenge_id=${challenge_id}&exercise_id=${id}`;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("HTTP Error " + response.status);
        return;
      }

      const res = await response.json();

      const data = res.exercise;

      setMode(res.mode);
      setExerciseTitle(data.exerciseTitle);
      setExerciseType(data.exerciseType);
      setProgression(data.progression);
      setRepetitions(data.repetitions);
    } catch (error) {
      console.error("Data retrieval error:", error);
      alert("Data loading error");
    }
  };

  const hadnleSave = async () => {
    setInProgress(true);
    await saveData();
    setInProgress(false);
    router.back();
  };

  const saveData = async () => {
    try {
      const token = await getUserToken();
      const url = `${process.env.EXPO_PUBLIC_SERVER_HOST}/exercise/saveExerciseProgress?challenge_id=${challenge_id}&exercise_id=${id}`;

      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progressionValue: progression }),
      });

      if (!response.ok) {
        alert("HTTP Error " + response.status);
        return;
      }
      const data = await response.json();

      if (data.completed) {
        await completeChallenge(challenge_id);
      }
    } catch (error) {
      console.error("Data save error:", error);
    }
  };

  const CAMERA_TEST_URL = `https://courageous-marshmallow-ab4850.netlify.app/?exerciseType=${encodeURIComponent(
    exerciseType
  )}`;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "exerciseData") {
        if (data.exercise == exerciseType) {
          const NewProgression = progression + data.count;
          setProgression(NewProgression);
        } else {
          console.log("Incorrect exercise type detection");
        }
      }
    } catch (error) {
      console.error("Error parsing WebView message (from onMessage):", error);
    }
  };

  const getFormattedProgress = (progression: any, repetitions: any) => {
    const numProgression = Number(progression);
    const numRepetitions = Number(repetitions);

    let progressBarValue = 0;
    let percentageText = "0%";

    if (
      !isNaN(numProgression) &&
      !isNaN(numRepetitions) &&
      numRepetitions !== 0
    ) {
      let rawProgress = numProgression / numRepetitions;

      progressBarValue = Math.max(0, Math.min(1, rawProgress));

      const percentage = rawProgress * 100;
      percentageText = `${percentage.toFixed(0)}%`;
    }

    return {
      progressBarValue,
      percentageText,
    };
  };

  const { progressBarValue, percentageText } = getFormattedProgress(
    progression,
    repetitions
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user]);

  useEffect(() => {
    const getData = async () => {
      await fetchChallengeData();
      await getFormattedProgress(progression, repetitions);
    };
    getData();

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  if (loading || hasCameraPermission === null) {
    return (
      <ActivityIndicator
        size="large"
        color="#9A5CEE"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  if (!user) {
    return null;
  }

  if (hasCameraPermission === false) {
    return (
      <View style={styles.container}>
        <Text>
          No access to camera. Please enable camera permissions in your device
          settings to use this feature.
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.back();
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
    );
  }

  return (
    <View style={styles.container}>
      <LoadingScreen visible={inProgress} />
      <View style={styles.webViewContainer}>
        <WebView
          useWebKit
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          originWhitelist={["*"]}
          source={{ uri: CAMERA_TEST_URL }}
          onMessage={handleWebViewMessage}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowInlineMediaPlayback={true}
          mixedContentMode="compatibility"
          cacheEnabled={true}
          scalesPageToFit={true}
          geolocationEnabled={true}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          userAgent="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
          onPermissionRequest={(request: any) => {
            request.grant();
          }}
          startInLoadingState={true}
          domStorageEnabled={true}
          thirdPartyCookiesEnabled={true}
          bounces={false}
        />
      </View>

      {mode === "total" ? (
        <Text style={styles.titleExercise}>
          Your current progress {progression} / {repetitions}
        </Text>
      ) : exerciseType === "plank" ? (
        <Text style={styles.titleExercise}>
          Complete {repetitions} sec today to meet the deadline
        </Text>
      ) : (
        <Text style={styles.titleExercise}>
          Complete {repetitions} repetitions today to meet the deadline
        </Text>
      )}

      <View style={styles.statExercise}>
        <View style={[styles.ExerciseRow, { marginBottom: 10 }]}>
          <View style={styles.backRoundIconExercise}>
            {exerciseType === "plank" ? (
              <PlankIcon />
            ) : exerciseType === "push-ups" ? (
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
              <Text style={styles.procent}>{percentageText}</Text>
            </View>
            <ProgressBar
              progress={progressBarValue}
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

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={styles.opacityButton}
          >
            <Text style={styles.buttonGradientText}>Go Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setProgression(progression + 1);
            }}
            style={styles.opacityButton}
          >
            <Text style={styles.buttonGradientText}>ADdd</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.buttonContainer} onPress={hadnleSave}>
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonGradientText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
