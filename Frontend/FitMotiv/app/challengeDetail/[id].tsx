import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { styles as styles } from "../../src/Styles/challengesDetail-ID";
import { ClockIcon } from "@/src/Icons/challengeDetailIcons";
import { RecipientIcon } from "@/src/Icons/WalletIcons";
import { SquatIcon } from "@/src/Icons/challengeDetailIcons";
import { ProgressBar, MD3Colors } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.contentText}>
          <Text style={styles.challengeTitle}>Do 10 squats</Text>
          <Text style={styles.challengeDescription}>
            You have to do 10 squats and plank 2 min per day for 1 week
          </Text>
        </View>

        <View style={styles.recepientDataRow}>
          <View style={{ flexDirection: "row" }}>
            <RecipientIcon />
            <Text style={[styles.challengeDescription, { paddingLeft: 5 }]}>
              0xFA223FFDD2
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
              $15
            </Text>
          </View>
        </View>

        <View style={styles.timeTable}>
          <ClockIcon />
          <Text style={styles.timeLeft}>15 hours left</Text>
        </View>

        <View style={styles.ExerciseContainer}>
          <Text style={[styles.challengeDescription, { paddingBottom: 5 }]}>
            Exercise
          </Text>
          <View style={styles.ExerciseRow}>
            <View style={styles.backRoundIconExercise}>
              <SquatIcon />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.ExerciseRow}>
                <Text style={styles.ExerciseTitle}> 10 squats </Text>
                <Text style={styles.procent}> 70% </Text>
              </View>
              <ProgressBar
                progress={0.7}
                color="#9A5CEE"
                style={{
                  height: 15,
                  borderRadius: 8,
                  backgroundColor: "#e0e0e0",
                }}
                fillStyle={{
                  borderRadius: 8,
                }}
              />
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={() => {}} style={styles.buttonContainer}>
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