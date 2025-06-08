import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  Modal,
  GestureResponderEvent,
} from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { styles as styles } from "../src/Styles/createExercise";
import { LinearGradient } from "expo-linear-gradient";
import {
  AiIcon,
  DurationIcon,
  ExerciseIcon,
  MoneyIcon,
  PlankIc,
  PushUpIc,
  RocketIcon,
  SquatIc,
  TitleIcon,
} from "@/src/Icons/createChallengeIcons";
import { TextInput } from "react-native-paper";
import { RecepientIcon } from "@/src/Icons/createChallengeIcons";
import { getBalance } from "@/Web3Module/getBalance";
import { getWalletData } from "@/context/LocalData/getFromAsync";
import { getAIAnswer } from "@/context/LLM/textGenerator";

export default function CreateExerciseScreen() {
  const currentUser = auth.currentUser;

  const isValidHEXAddress = (address: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(address);

  const { width, height } = Dimensions.get("window");

  const [title, setTitle] = useState<string>("");
  const [recepientAddress, setRecepientAddress] = useState<string>("");
  const [duration, setDuration] = useState(new Date());
  const [inputValue, setInputValue] = useState<string>("");

  const [challengeBet, setChallengeBet] = useState<string>("0");
  const [currentUserBalance, setCurrentUserBalance] = useState<number>(0);
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string>("");
  const [selectedExercises, setSelectedExercises] = useState<{
    [rowIndex: number]: number | null;
  }>({});

  const [repetitions, setRepetitions] = useState<{
    [exerciseId: number]: string;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(
    null
  );
  const [isPressed, setIsPressed] = useState(false);
  const [mode, setMode] = useState<string>("per");
  const [generateIndex, setGenerateIndex] = useState<string>("");

  const [selectedTime, setSelectedTime] = useState<number>();

  const [color, setColor] = useState<string>("white");
  const [buttonIndex, setButtonIndex] = useState<boolean>(true);

  const [incorrectInputIndex, setIncorrectInputIndex] = useState<number>()

  const [exercises, setExercises] = useState([
    { id: 1, type: "plank" },
    { id: 2, type: "squats" },
    { id: 3, type: "push-ups" },
  ]);

  const chunkedExercises = [];
  for (let i = 0; i < exercises.length; i += 3) {
    chunkedExercises.push(exercises.slice(i, i + 3));
  }

  const fetchUsdtToEthRate = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_GET_RATE}`);
      const data = await response.json();
      setRate(data.tether.eth);
    } catch (err) {
      setError("Error getting rate");
    }
  };

  const handleSetWallet = async () => {
    const wallet = await getWalletData();

    if (wallet) {
      if (recepientAddress == wallet.address) {
        setRecepientAddress("");
      } else {
        setRecepientAddress(wallet.address);
      }
    }
  };

  const { user, loading } = useAuth();

  useEffect(() => {
    const getWallet = async () => {
      const wallet = await getWalletData();

      if (wallet) {
        const data = await getBalance(wallet.address);
        setCurrentUserBalance(+data);
      }
    };

    getWallet();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
    fetchUsdtToEthRate();
  }, [loading, user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  const onSendChallenge = async () => {
    if (!isValidHEXAddress(recepientAddress)) {
      setIncorrectInputIndex(0)
      return;
    }

    if (parseFloat(challengeBet) > currentUserBalance) {
      setIncorrectInputIndex(5)
      return;
    }

    if (!title) {
      setIncorrectInputIndex(1)
      return;
    }

    if (!duration) {
      setIncorrectInputIndex(3)
      return;
    }

    const formattedExercises = Object.entries(selectedExercises)
      .filter(
        ([rowIndex, exerciseId]) =>
          exerciseId !== null && repetitions[exerciseId!]
      )
      .map(([rowIndex, exerciseId]) => {
        const exercise = exercises.find((e) => e.id === exerciseId!);
        return {
          type: exercise?.type,
          repetitions: Number(repetitions[exerciseId!]),
        };
      });

    if (formattedExercises.length === 0) {
       setIncorrectInputIndex(6)
      return;
    }

    const challengePayload = {
      recepient: recepientAddress,
      title,
      mode: mode,
      exercises: formattedExercises,
      duration: duration.getTime(),
      bet: parseFloat(challengeBet),
      message,
    };

    if (!currentUser) {
      console.log("No user is signed in");
      return;
    }
    const token = await currentUser.getIdToken();

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_HOST}/challenge/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(challengePayload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        Alert.alert("Error", result.message || "Something went wrong");
      } else {
        Alert.alert("Success", "Challenge created successfully");
        router.push("/(tabs)");
      }
    } catch (err) {
      console.error("Challenge creation failed", err);
      Alert.alert("Error", "Failed to create challenge");
    }
  };

  const handlePress = (index: number, exerciseId: number) => {
    setIsPressed(!isPressed);
    setSelectedExercises((prev) => ({
      ...prev,
      [index]: prev[index] === exerciseId ? null : exerciseId,
    }));
  };

  const handleRepetitionChange = (exerciseId: number, value: string) => {
    setRepetitions((prevRepetitions) => ({
      ...prevRepetitions,
      [exerciseId]: value,
    }));
  };

  const openRepetitionsModal = (exerciseId: number, rowIndex: number) => {
    if (selectedExercises[rowIndex] === exerciseId) {
      setCurrentExerciseId(exerciseId);
      setModalVisible(true);
    }
  };

  const selectRepetition = (value: string) => {
    if (currentExerciseId !== null) {
      handleRepetitionChange(currentExerciseId, value);
      setModalVisible(false);
    }
  };

  const handleAdd = () => {
    if (exercises.length < 9) {
      const nextId = exercises.length + 1;
      const addExercises = [
        { id: nextId, type: "plank" },
        { id: nextId + 1, type: "squats" },
        { id: nextId + 2, type: "push-ups" },
      ];
      setExercises((prevExercises) => [...prevExercises, ...addExercises]);
    } else {
      Alert.alert("Error", "Maximum of exercises to choose");
    }
  };

  const handleSetDuration = (time: number, index: number) => {
    const newDate = new Date();
    newDate.setHours(newDate.getHours() + time);
    setDuration(newDate);
    setSelectedTime(index);
  };

  const handleAIGenerate = async (inp: string) => {
    if (inp === "title") {
      setButtonIndex(true);
    } else {
      setButtonIndex(false);
    }

    const colors = ["#B687FF", "#9A5CEE", "#7A3BBF", "#5C2E9A", "#3D1E66"];
    let colorIndex = 0;
    setColor(colors[colorIndex]);

    const intervalId = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setColor(colors[colorIndex]);
    }, 100);

    const ans = await getAIAnswer(inp);

    clearInterval(intervalId);

    if (inp === "title") {
      setTitle(ans);
    } else {
      setMessage(ans);
    }
    setColor("white");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <RecepientIcon />
            <Text style={styles.label}>Recipient</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={[styles.textInputBackround, { width: width * 0.55, borderColor: incorrectInputIndex == 0 ? '#D23538' : '#1e1e1e', borderWidth: 0.5 }]}
            >
              <TextInput
                style={styles.textInput}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor="white"
                placeholder="0xC5041cBbB..."
                value={recepientAddress}
                onChangeText={(text) => setRecepientAddress(text)}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.durationBackround]}
              onPress={handleSetWallet}
            >
              <Text style={styles.durationTitle}>Send To Yourself</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <TitleIcon />
            <Text style={styles.label}>Title</Text>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={[styles.textInputBackround, { width: width * 0.6,borderColor: incorrectInputIndex == 1 ? '#D23538' : '#1e1e1e', borderWidth: 0.5 }]}
              >
                <TextInput
                  style={styles.textInput}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="white"
                  placeholder="You have to do..."
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.durationBackround,
                  { flexDirection: "row", alignItems: "center" },
                ]}
                onPress={() => handleAIGenerate("title")}
              >
                <AiIcon color={buttonIndex ? color : "white"} />
                <Text
                  style={[
                    styles.durationTitle,
                    { marginLeft: 5, color: buttonIndex ? color : "white" },
                  ]}
                >
                  Generate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={
                mode === "per" ? styles.DepositButton : styles.opacityButton
              }
              onPress={() => setMode("per")}
            >
              {mode === "per" ? (
                <LinearGradient
                  colors={["#6412DF", "#CDA2FB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  locations={[0, 0.9]}
                  style={[styles.buttonGradient, { width: width * 0.4 }]}
                >
                  <Text style={styles.buttonGradientText}>Per Day</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.buttonGradientText}>Per Day</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={
                mode === "total" ? styles.DepositButton : styles.opacityButton
              }
              onPress={() => setMode("total")}
            >
              {mode === "total" ? (
                <LinearGradient
                  colors={["#6412DF", "#CDA2FB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  locations={[0, 0.9]}
                  style={[styles.buttonGradient, { width: width * 0.4 }]}
                >
                  <Text style={styles.buttonGradientText}>
                    Total To Complete
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={styles.buttonGradientText}>Total To Complete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <ExerciseIcon />
            <Text style={styles.label}>Exercises</Text>
          </View>

          {chunkedExercises.map((chunk, index) => (
            <View key={index} style={styles.exercisesRow}>
              {chunk.map((exercise) => (
                <View key={exercise.id} style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => handlePress(index, exercise.id)}
                    style={
                      selectedExercises[index] === exercise.id
                        ? styles.exerciseSquereIsPressed
                        : styles.exerciseSquere
                    }
                  >
                    {exercise.type === "plank" ? (
                      <PlankIc
                        color={
                          selectedExercises[index] === exercise.id
                            ? "#fff"
                            : "#9A5CEE"
                        }
                      />
                    ) : exercise.type === "squats" ? (
                      <SquatIc
                        color={
                          selectedExercises[index] === exercise.id
                            ? "#fff"
                            : "#9A5CEE"
                        }
                      />
                    ) : (
                      <PushUpIc
                        color={
                          selectedExercises[index] === exercise.id
                            ? "#fff"
                            : "#9A5CEE"
                        }
                      />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.exerciseTitle}>
                    {exercise.type === "plank"
                      ? "Plank"
                      : exercise.type === "squats"
                      ? "Squats"
                      : "Push Ups"}
                  </Text>
                </View>
              ))}

              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={[styles.exerciseSquere, {borderColor: incorrectInputIndex == 6 ? '#D23538' : '#1e1e1e', borderWidth: 0.5}]}
                  onPress={() =>
                    openRepetitionsModal(selectedExercises[index] || 0, index)
                  }
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    {selectedExercises[index] &&
                    repetitions[selectedExercises[index]]
                      ? repetitions[selectedExercises[index]]
                      : "Tap to select"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.exerciseTitle}>Repetitions</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.inputContainer, { alignItems: "center" }]}>
          <TouchableOpacity
            style={[styles.opacityButton, { height: 24, width: 200 }]}
            onPress={handleAdd}
          >
            <Text style={[styles.buttonGradientText, {}]}>
              + Add another exercise
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <DurationIcon />
            <Text style={styles.label}>Duration</Text>
          </View>

          <View style={styles.exercisesRow}>
            <TouchableOpacity
              style={[
                styles.durationBackround,
                selectedTime === 0 && { backgroundColor: "#9A5CEE" },
              ]}
              onPress={() => handleSetDuration(12, 0)}
            >
              <Text style={styles.durationTitle}>12h</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.durationBackround,
                selectedTime === 1 && { backgroundColor: "#9A5CEE" },
              ]}
              onPress={() => handleSetDuration(24, 1)}
            >
              <Text style={styles.durationTitle}>24h</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.durationBackround,
                selectedTime === 2 && { backgroundColor: "#9A5CEE" },
              ]}
              onPress={() => handleSetDuration(72, 2)}
            >
              <Text style={styles.durationTitle}>3 days</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.durationBackround,
                selectedTime === 3 && { backgroundColor: "#9A5CEE" },
              ]}
              onPress={() => handleSetDuration(168, 3)}
            >
              <Text style={styles.durationTitle}>7 days</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.durationBackround,
                {
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  height: 40,
                  width: 68,
                  borderColor: incorrectInputIndex == 3 ? '#D23538' : '#1e1e1e', borderWidth: 0.5
                },
              ]}
            >
              <TextInput
                style={styles.textInput}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                placeholder="90h"
                textColor="white"
                keyboardType="numeric"
                value={inputValue}
                onChangeText={(text) => {
                  setInputValue(text);
                  const parsed = parseInt(text, 10);
                  if (!isNaN(parsed)) {
                    handleSetDuration(parsed, 4);
                  }
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <MoneyIcon />
            <Text style={styles.label}>Challenge bet (ETH)</Text>
          </View>

          <View style={styles.labelRow}>
            <TouchableOpacity
              style={[styles.textInputBackround, { width: width * 0.5,borderColor: incorrectInputIndex == 5 ? '#D23538' : '#1e1e1e', borderWidth: 0.5 }]}
            >
              <TextInput
                style={styles.textInput}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor="white"
                placeholder="Enter challenge bet"
                keyboardType="numeric"
                value={challengeBet}
                onChangeText={(text) => setChallengeBet(text)}
              />
            </TouchableOpacity>
            {rate !== null && (
              <Text
                style={[
                  styles.durationTitle,
                  { marginLeft: 15, color: "#747474" },
                ]}
              >
                ≈${(parseFloat(challengeBet) / rate).toFixed(4)}
              </Text>
            )}
          </View>
          <View style={styles.labelRow}>
            <Text style={[styles.durationTitle, { color: "#747474" }]}>
              Current wallet balance
            </Text>
            <Text style={styles.durationTitle}> {currentUserBalance} ETH</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <TitleIcon />
            <Text style={styles.label}>Message</Text>
            <Text
              style={[
                styles.durationTitle,
                { color: "#747474", marginLeft: 5 },
              ]}
            >
              (Optional)
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={[styles.textInputBackround, { width: width * 0.6 }]}
            >
              <TextInput
                style={styles.textInput}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor="white"
                placeholder="I swear you..."
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.durationBackround,
                { flexDirection: "row", alignItems: "center" },
              ]}
              onPress={() => handleAIGenerate("message")}
            >
              <AiIcon color={!buttonIndex ? color : "white"} />
              <Text
                style={[
                  styles.durationTitle,
                  { marginLeft: 5, color: !buttonIndex ? color : "white" },
                ]}
              >
                Generate
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={onSendChallenge}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={styles.buttonGradient}
            >
              <RocketIcon />
              <Text style={[styles.buttonGradientText, { marginLeft: 15 }]}>
                Send Challenge
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: 10,
              padding: 20,
              width: width * 0.8,
              maxHeight: height * 0.7,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Select Repetitions
            </Text>
            <ScrollView>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                <TouchableOpacity
                  key={num}
                  style={{
                    padding: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#333",
                    alignItems: "center",
                  }}
                  onPress={() => selectRepetition(num.toString())}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>{num}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 15,
                padding: 10,
                borderRadius: 25,
                backgroundColor: "#9A5CEE",
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
