import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { styles as styles } from "../../src/Styles/challengesDetail-ID";
import { ClockIcon } from "@/src/Icons/challengeDetailIcons";
import { RecipientIcon } from "@/src/Icons/WalletIcons";
import { SquatIcon, PlankIcon } from "@/src/Icons/challengeDetailIcons";
import { ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

type Exercise = {
  id: number;
  title: string;
  description: string;
  sender: string;
  money: number;
  deadline: number;
  exercises: {id: number; exerciseType: string; exerciseTitle: string; progression: number }[];
};


export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);

  const mockData: Exercise[] = [
    { 
      id: 1,
      title: "Do 10 squats",
      description: "You have to do 10 squats per day for 1 week", 
      sender: "0xFAD2432fD22D", 
      money: 15,
      deadline: 2025, 
      exercises: [
        { id: 321, exerciseType: "squats", exerciseTitle: "10 Squats", progression: 70 },
        { id: 534, exerciseType: "plank", exerciseTitle: "1 Minute Plank", progression: 20 },
        { id: 421, exerciseType: "squats", exerciseTitle: "10 Squats", progression: 15 },
      ]
    }
  ];

  useEffect(() => {
    setExercise(mockData[0]);
  }, []);

  const renderExerciseItem = ({ item }: { item: { id: number; exerciseType: string; exerciseTitle: string; progression: number } }) => {
    return (
      <TouchableOpacity style={[styles.ExerciseRow, { marginBottom: 10 }]}>
        <View style={styles.backRoundIconExercise}>
          {item.exerciseType == "plank" ? <PlankIcon /> : <SquatIcon />}
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={styles.ExerciseTitle}>{item.exerciseTitle}</Text>
            <Text style={styles.procent}>{item.progression}%</Text>
          </View>
          <ProgressBar
            progress={item.progression / 100}
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

  return (
    <View style={styles.container}>
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
            {exercise?.sender}
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
              ${exercise?.money}
            </Text>
          </View>
        </View>

        <View style={styles.timeTable}>
          <ClockIcon />
          <Text style={styles.timeLeft}>{exercise?.deadline}</Text>
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
              style={{ width: '100%' }}
            />
          )}
        </View>
      </View>
      
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={() => {router.push("/exerscise")}} style={styles.buttonContainer}>
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
    </View>
  );
}