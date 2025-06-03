import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { styles as styles } from "../../src/Styles/challengesDetail-ID";
import { ClockIcon } from "@/src/Icons/challengeDetailIcons";
import { RecipientIcon } from "@/src/Icons/WalletIcons";
import {
  SquatIcon,
  PlankIcon,
  PushUpsIc,
} from "@/src/Icons/challengeDetailIcons";
import { Button, ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { getUserToken } from "@/context/authContext/getUserToken";
import { fetchUsdtToEthRate } from "@/context/getPrice/getETHPrice";

type Exercise = {
  id: string;
  title: string;
  description: string;
  sender: string;
  money: number;
  deadline: number;
  ChallengeStatus: String;
  exercises: {
    id: string;
    exerciseType: string;
    exerciseTitle: string;
    progression: number;
    repetitions: number;
  }[];
};

type SelectedExercise = {
  id: string;
  exerciseType: string;
};

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [rate, setRate] = useState<number | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const [StartButtonVisible, setStartButtonVisible] = useState(true);
  const [selectedExercise, setSelectedExercise] =
    useState<SelectedExercise | null>(null);

  const handleSelected = (id: string, exerciseType: string) => {
    setSelectedExercise({ id, exerciseType });
  };

  const handleStart = () => {
    if (!selectedExercise?.id) {
      Alert.alert("Error", "You have to choose 1 exercise!");
    } else {
      router.push({
        pathname: "/exercise/[id]",
        params: {
          id: selectedExercise.id.toString(),
          challenge_id: id,
        },
      });
    }
  };

  const activateChallenge = async () => {
    const token = await getUserToken();

    const url = `${process.env.EXPO_PUBLIC_SERVER_HOST}/challenge/setActiveChallenge`;

    const exercise_id = id;

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ exercise_id }),
    });

    if (!response.ok) {
      alert("HTTP Error " + response.status);
      setLoading(false);
      return;
    }

    fetchChallengeData();
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

  const handleExit = () => {
    setModalVisible(false);
    router.push("/(tabs)");
  };

  const handleConfirm = async () => {
    setModalVisible(false);
    await activateChallenge();
    setModalVisible(false);
  };

  const getRate = async () => {
    try {
      const rate = await fetchUsdtToEthRate();
      setRate(rate);
    } catch (err) {}
  };

  const fetchChallengeData = async () => {
    const token = await getUserToken();

    const url = `${process.env.EXPO_PUBLIC_SERVER_HOST}/challenge/getChallengeData?exercise_id=${id}`;

    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("HTTP Error " + response.status);
      setLoading(false);
      return;
    }
    const data = await response.json();
    setExercise(data.challenge);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchChallengeData();
        getRate();
      } else {
        console.log("ID is missing or falsy");
      }
    }, [id])
  );

  useEffect(() => {
    if (exercise?.ChallengeStatus === "Completed") {
      setStartButtonVisible(false);
    }
  }, [exercise?.ChallengeStatus]);

  if (exercise?.ChallengeStatus == "Awaiting") {
    return (
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Challenge awaits confirmation</Text>
            <Text style={styles.message}>
              Do you want to activate this challenge?
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  Continue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.exitButton]}
                onPress={handleExit}
              >
                <Text style={styles.buttonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const renderExerciseItem = ({
    item,
  }: {
    item: {
      id: string;
      exerciseType: string;
      exerciseTitle: string;
      progression: number;
      repetitions: number;
    };
  }) => {
    const { progressBarValue, percentageText } = getFormattedProgress(
      item.progression,
      item.repetitions
    );

    return (
      <TouchableOpacity
        onPress={() => handleSelected(item.id, item.exerciseType)}
        style={
          selectedExercise?.id == item.id
            ? [
                styles.ExerciseRow,
                {
                  marginBottom: 10,
                  backgroundColor: "#747474",
                  borderRadius: 15,
                },
              ]
            : [styles.ExerciseRow, { marginBottom: 10 }]
        }
      >
        <View style={styles.backRoundIconExercise}>
          {item.exerciseType === "plank" ? (
            <PlankIcon />
          ) : item.exerciseType === "push-ups" ? (
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
            <Text style={styles.ExerciseTitle}>{item.exerciseTitle}</Text>
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
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9A5CEE" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!exercise && <Text>Loading...</Text>}

      <View style={styles.contentContainer}>
        <View style={styles.contentText}>
          <Text style={styles.challengeTitle}>{exercise?.title}</Text>
          <Text style={styles.challengeDescription}>
            {exercise?.description}
          </Text>
        </View>

        <View style={styles.recepientDataRow}>
          <View style={{ flexDirection: "row" }}>
            <RecipientIcon />
            <Text style={[styles.challengeDescription, { paddingLeft: 5 }]}>
              {exercise?.sender ? exercise.sender.slice(0, 15) + "..." : ""}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.challengeDescription}>To earn </Text>
            <Text
              style={[
                styles.challengeDescription,
                { paddingLeft: 5, color: "#2BC4AD" },
              ]}
            >
              {exercise?.money != null && typeof rate === "number" && rate > 0
                ? `≈ $${(exercise.money / rate).toFixed(2)}`
                : "loading.."}
            </Text>
          </View>
        </View>

        <View style={styles.timeTable}>
          <ClockIcon />
          <Text style={styles.timeLeft}>
            {exercise?.deadline
              ? new Date(exercise.deadline).toLocaleString()
              : "Empty"}
          </Text>
        </View>
        <View style={styles.ExerciseContainer}>
          <Text style={[styles.challengeDescription, { paddingBottom: 5 }]}>
            Exercise
          </Text>
          {exercise?.exercises && (
            <FlatList
              data={exercise.exercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              style={{ width: "100%" }}
            />
          )}
        </View>
      </View>

      {StartButtonVisible && (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleStart}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonGradientText}>Start</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
