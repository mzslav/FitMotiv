import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import useAuth from "@/context/authContext/auth";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { styles as styles } from "../../src/Styles/challenges";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { TotalIcon } from "@/src/Icons/IconTotal";
import { getUserToken } from "@/context/authContext/getUserToken";
import { fetchUsdtToEthRate } from "@/context/getPrice/getETHPrice";

const { width, height } = Dimensions.get("window");

type Challenge = {
  id: string;
  ChallengeTitle: string;
  ChallengeStatus: string;
  Price: number;
};

export default function ChallengesScreen() {
  const { user, loading } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [load, setLoad] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rate, setRate] = useState<number | null>(null);

  const fetchUserChallenges = async () => {
    const token = await getUserToken();

    let response = await fetch(
      `${process.env.EXPO_PUBLIC_SERVER_HOST}/challenge/all`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert("HTTP Error " + response.status);
      setLoad(false);
      return [];
    }

    const rawData = await response.json();

    const transformed: Challenge[] = rawData.challenges.map(
      (challenge: any) => ({
        id: challenge.id,
        ChallengeTitle: challenge.ChallengeTitle,
        ChallengeStatus: challenge.ChallengeStatus,
        Price: parseFloat(challenge.Price),
      })
    );

    setLoad(false);

    return transformed;
  };

  const getRate = async () => {
    try {
      const rate = await fetchUsdtToEthRate();
      setRate(rate);
    } catch (err) {}
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchUserChallenges();
    setChallenges(data);
    getRate();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const loadChallenges = async () => {
      const data = await fetchUserChallenges();
      setChallenges(data);
    };
    getRate();
    loadChallenges();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user]);

  useEffect(() => {
    setTotalChallenges(challenges.length);
  }, [challenges]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  if (load) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#BABABA" />
        <Text>Loading..</Text>
      </View>
    );
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/challengeDetail/[id]",
                params: { id: item.id.toString() },
              })
            }
          >
            <View style={styles.exersiceTable}>
              <View style={{ marginRight: 50, marginLeft: 20 }}>
                <View style={{ marginBottom: 8, marginTop: 10 }}>
                  <Text style={styles.exersiceTitle}>
                    {item.ChallengeTitle.length > 10
                      ? `${item.ChallengeTitle.slice(0, 7)}...`
                      : item.ChallengeTitle}
                  </Text>
                </View>
                <View
                  style={[styles.exersicePriceBackround, { marginBottom: 10 }]}
                >
                  {rate !== null ? (
                    <Text style={styles.exersiceTitle}>
                      ≈ ${(item.Price / rate).toFixed(2)}
                    </Text>
                  ) : (
                    <Text style={styles.exersiceTitle}>Loading...</Text>
                  )}
                </View>
              </View>
              <View
                style={[
                  styles.exersiceStatusBackround,
                  item.ChallengeStatus === "Active"
                    ? {}
                    : item.ChallengeStatus === "Awaiting"
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <TotalIcon />
            <Text style={[styles.TotalText, { marginLeft: 7 }]}>
              Total challenges
            </Text>
          </View>
          <Text style={[styles.TotalText, { paddingRight: 27 }]}>
            {totalChallenges}
          </Text>
        </View>
      </View>
    </View>
  );
}
