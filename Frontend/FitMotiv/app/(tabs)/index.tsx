import "react-native-get-random-values";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useCallback, useEffect, useState } from "react";
import { styles as styles } from "../../src/Styles/Index";
import { LinearGradient } from "expo-linear-gradient";
import { BalanceIcon } from "@/src/Icons/WalletIcons";
import { DurationIcon, RecepientIcon } from "@/src/Icons/createChallengeIcons";
import { BellIcon, TrophyIcon } from "@/src/Icons/indexIcons";
import { TotalIcon } from "@/src/Icons/IconTotal";
import { fetchUsdtToEthRate } from "@/context/getPrice/getETHPrice";
import { getWalletData } from "../../context/LocalData/getFromAsync";
import { getBalance } from "@/Web3Module/getBalance";
import { getUserToken } from "@/context/authContext/getUserToken";
import { getOnBoardingStatus } from '../../context/LocalData/onBoarding'
import AsyncStorage from "@react-native-async-storage/async-storage";

type TransactionCreated = {
  id: string;
  recepeintAddress: string;
  Status: string;
};

type TransactionAccepted = {
  id: string;
  recepeintAddress: string;
  Title: string;
};

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const [load, setLoad] = useState(true);
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showStats, setShowStats] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<string>("0");
  const [expectedMoney, setExpectedMoney] = useState<number>(0);
  const [expectedTasks, setExpectedTasks] = useState<number>(0);
  const [walletExist, setWalletExist] = useState<boolean>(false);
  const [achivmentsTasks, setAchivmentsTasks] = useState<number>(0);
  const [achivmentsEarn, setAchivmentsEarn] = useState<number>(0);
  const [newChallenges, setNewChallenges] = useState<number>(0);
  const [createdTransactions, setCreatedTransactions] = useState<
    TransactionCreated[]
  >([]);
  const [AcceptedTransactions, setAcceptedTransactions] = useState<
    TransactionAccepted[]
  >([]);

  useEffect(() => {
    const get = async () => {
      await AsyncStorage.removeItem('OnBoarding')
      // await getOnBoardingStatus()
      const wallet = await getWalletData();
      if (wallet) {
        const data = await getBalance(wallet.address);
        setCurrentBalance(data);
        setWalletExist(true);
      }
    };

    get();
  }, []);

  const fetchUserChallengesData = async () => {
    const token = await getUserToken();

    let response = await fetch(
      `${process.env.EXPO_PUBLIC_SERVER_HOST}/log/indexData`,
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

    const {
      challengesCreated,
      challengesAccepted,
      amountEarn,
      amountTasks,
      newChallenges,
    } = await response.json();

    setCreatedTransactions(challengesCreated);
    setAcceptedTransactions(challengesAccepted);
    setAchivmentsTasks(amountTasks);
    setAchivmentsEarn(amountEarn);
    setNewChallenges(newChallenges);
  };

  const fetchExpectedAmount = async () => {
    const token = await getUserToken();

    let response = await fetch(
      `${process.env.EXPO_PUBLIC_SERVER_HOST}/challenge/getExpectedAmount`,
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

    const RawData = await response.json();

    const amount = RawData.amount;
    const tasks = RawData.amountTasks;
    setExpectedMoney(amount);
    setExpectedTasks(tasks);
  };

  const getRate = async () => {
    try {
      const rate = await fetchUsdtToEthRate();
      setRate(rate);
    } catch (err) {
      setError("Error while get data");
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user]);

  useFocusEffect(
    useCallback(() => {
      fetchUserChallengesData();
      fetchExpectedAmount();
      getRate();
      setLoad(false);
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  if (load) {
    return (
      <View style={[styles.container, { justifyContent: "flex-start" }]}>
        <ActivityIndicator size="large" />;
      </View>
    );
  }
  const handleShowCreatedStats = () => {
    setShowStats(0);
  };

  const handleShowAcceptedStats = () => {
    setShowStats(1);
  };

  return (
    <View style={[styles.container, { justifyContent: "flex-start" }]}>
      <View>
        <LinearGradient
          colors={["#6412DF", "#CDA2FB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.9]}
          style={styles.containerGradient}
        >
          <View style={styles.balanceHeader}>
            <BalanceIcon />
            <Text style={styles.currentBalance}>Total balance</Text>
          </View>
          <View style={styles.balanceRow}>
            {rate !== null ? (
              walletExist == false ? (
                <Text style={styles.balanceETH}>No Data</Text>
              ) : (
                <Text style={styles.balanceETH}>
                  ${(parseFloat(currentBalance) / rate).toFixed(2)}
                </Text>
              )
            ) : (
              <Text style={styles.balanceETH}>Loading...</Text>
            )}

            <View style={styles.exersicePriceBackround}>
              {rate !== null ? (
                walletExist == false ? (
                  <Text style={styles.balanceBonus}>No Data</Text>
                ) : (
                  <Text style={styles.balanceBonus}>
                    +${(expectedMoney / rate).toFixed(2)}
                  </Text>
                )
              ) : (
                <Text style={styles.balanceBonus}>Loading...</Text>
              )}
            </View>
          </View>
          <View style={[styles.balanceHeader, { marginTop: 20 }]}>
            <DurationIcon color="#c8c8c8" />

            {expectedTasks !== 0 ? (
              <Text
                style={[
                  styles.currentBalance,
                  { fontSize: 12, color: "#c8c8c8" },
                ]}
              >
                Expected from {expectedTasks} challenges
              </Text>
            ) : (
              <Text
                style={[
                  styles.currentBalance,
                  { fontSize: 12, color: "#c8c8c8" },
                ]}
              >
                No active challanges
              </Text>
            )}
          </View>
        </LinearGradient>

        <View>
          <TouchableOpacity style={styles.backroudAction}>
            <View style={styles.titleRow}>
              <BellIcon />

              <Text style={styles.currentBalance}>
                {newChallenges > 0
                  ? `${newChallenges} New Challenge Actions`
                  : "No New Challenge Actions"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={styles.backroudAction}>
            <View style={styles.titleRow}>
              <TrophyIcon />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.currentBalance}> My Achivments</Text>
                {rate !== null ? (
                  <Text
                    style={[
                      styles.currentBalance,
                      { fontSize: 12, color: "#c8c8c8" },
                    ]}
                  >
                    {" "}
                    Completed {achivmentsTasks} task for $
                    {(achivmentsEarn / rate).toFixed(2)}
                  </Text>
                ) : (
                  <Text> Loading...</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.challengesRow}>
          <View style={styles.tabItem}>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={handleShowCreatedStats}
            >
              <Text
                style={
                  showStats == 0
                    ? styles.isActiveSection
                    : styles.isNoActiveSection
                }
              >
                Created
              </Text>
            </TouchableOpacity>
            <View
              style={showStats == 0 ? styles.activeLine : styles.NoActiveLine}
            />
          </View>
          <View style={styles.tabItem}>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={handleShowAcceptedStats}
            >
              <Text
                style={
                  showStats == 1
                    ? styles.isActiveSection
                    : styles.isNoActiveSection
                }
              >
                Accepted
              </Text>
            </TouchableOpacity>
            <View
              style={showStats == 1 ? styles.activeLine : styles.NoActiveLine}
            />
          </View>
        </View>

        {showStats == 0 ? (
          <>
            <ScrollView style={styles.transactionsContainer}>
              {createdTransactions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.transactionItem}
                  onPress={() =>
                    router.push({
                      pathname: "/challengeDetail/[id]",
                      params: { id: item.id.toString() },
                    })
                  }
                >
                  <View style={styles.transactionRow}>
                    <View style={styles.transactionRow}>
                      <View style={{ marginRight: 5 }}>
                        <RecepientIcon />
                      </View>
                      <Text style={styles.transactionItemText}>
                        {item.recepeintAddress.length > 20
                          ? `${item.recepeintAddress.substring(0, 14)}...`
                          : item.recepeintAddress}
                      </Text>
                    </View>
                    {item.Status === "Awaiting" ? (
                      <Text style={styles.transactionItemTextAwaiting}>
                        Awaiting
                      </Text>
                    ) : item.Status === "Active" ? (
                      <Text style={styles.transactionItemTextAccepted}>
                        Accepted
                      </Text>
                    ) : (
                      <Text style={styles.transactionItemTextFinished}>
                        Finished
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.totalContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <TotalIcon />
                <Text style={[styles.TotalText, { marginLeft: 7 }]}>
                  Total Created
                </Text>
              </View>
              <Text style={[styles.TotalText, { paddingRight: 27 }]}>
                {createdTransactions.length}
              </Text>
            </View>
          </>
        ) : (
          <>
            <ScrollView style={styles.transactionsContainer}>
              {AcceptedTransactions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.transactionItem}
                  onPress={() =>
                    router.push({
                      pathname: "/challengeDetail/[id]",
                      params: { id: item.id.toString() },
                    })
                  }
                >
                  <View style={styles.transactionRow}>
                    <View style={styles.transactionRow}>
                      <View style={{ marginRight: 5 }}>
                        <RecepientIcon />
                      </View>
                      <Text style={styles.transactionItemText}>
                        {item.recepeintAddress.length > 20
                          ? `${item.recepeintAddress.substring(0, 14)}...`
                          : item.recepeintAddress}
                      </Text>
                    </View>
                    <Text style={styles.transactionItemTextAwaiting}>
                      {item.Title.length > 10
                        ? `${item.Title.substring(0, 10)}...`
                        : item.Title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.totalContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <TotalIcon />
                <Text style={[styles.TotalText, { marginLeft: 7 }]}>
                  Total Accepted
                </Text>
              </View>
              <Text style={[styles.TotalText, { paddingRight: 27 }]}>
                {AcceptedTransactions.length}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={() => {
            router.push("/createExercise");
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
            <Text style={styles.buttonGradientText}>Create New Challange</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
