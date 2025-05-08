import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import useAuth from "@/context/authContext/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { styles as styles } from "../../src/Styles/challenges";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { TotalIcon } from "@/src/Icons/IconTotal";

const { width, height } = Dimensions.get("window");

type Challenge = {
  id: number;
  ChallengeTitle: string;
  ChallengeStatus: string;
  Price: number;
};

export default function ChallengesScreen() {
  const { user, loading } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [totalChallenges, setTotalChallenges] = useState(0)

  const ChallangesMock = [
    {
      id: 1,
      ChallengeTitle: "Do plank 1 min",
      ChallengeStatus: "Active",
      Price: 90,
    },
    {
      id: 2,
      ChallengeTitle: "Do 10 squats",
      ChallengeStatus: "Awating",
      Price: 17,
    },
    {
      id: 3,
      ChallengeTitle: "Plank 1...",
      ChallengeStatus: "Completed",
      Price: 20,
    },
    {
      id: 4,
      ChallengeTitle: "10 squa...",
      ChallengeStatus: "Completed",
      Price: 20,
    },
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user]);

  useEffect(() => {
    setChallenges(ChallangesMock);
  }, []);

  useEffect(() => {
    setTotalChallenges(challenges.length)
  }, [challenges]);



  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <MaskedView
          maskElement={
            <Text style={[styles.title, { backgroundColor: "transparent" }]}>
              My Challenges
            </Text>
          }
        >
          <LinearGradient
            colors={["#EEEEEE", "#BABABA", "#888888"]}
            locations={[0, 0.51, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Text style={[styles.title, { opacity: 0 }]}>My Challenges</Text>
          </LinearGradient>
        </MaskedView>
      </View>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({
            pathname: '/challengeDetail/[id]',
            params: {id: item.id.toString()}
          })}>
            <View style={styles.exersiceTable}>
              <View style={{ marginRight: 50, marginLeft: 20 }}>
                <View style={{ marginBottom: 8, marginTop: 10 }}>
                  <Text style={styles.exersiceTitle}>
                    {item.ChallengeTitle.length > 20
                      ? `${item.ChallengeTitle.substring(0, 10)}...`
                      : item.ChallengeTitle}
                  </Text>
                </View>
                <View
                  style={[styles.exersicePriceBackround, { marginBottom: 10 }]}
                >
                  <Text style={styles.exersiceTitle}>≈ ${item.Price}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.exersiceStatusBackround,
                  item.ChallengeStatus === "Active"
                    ? {}
                    : item.ChallengeStatus === "Awating"
                    ? { backgroundColor: "grey" }
                    : item.ChallengeStatus === "Completed"
                    ? { backgroundColor: "transparent" }
                    : { backgroundColor: "black" },
                ]}
              >
                <Text style={styles.exersiceTitle}>{item.ChallengeStatus}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View
        style={[styles.exersiceTable, { marginTop: 20, width: width * 0.92 }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, }}>
            <TotalIcon />
            <Text style={[styles.TotalText, { marginLeft: 7 }]}>
              Total challenges
            </Text>
          </View>
          <Text style={[styles.TotalText, {paddingRight: 27}]}>{totalChallenges}</Text>
        </View>
      </View>
    </View>
  );
}
