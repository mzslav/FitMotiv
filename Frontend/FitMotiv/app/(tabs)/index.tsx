import 'react-native-get-random-values';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { styles as styles } from "../../src/Styles/Index";
import { LinearGradient } from "expo-linear-gradient";
import { BalanceIcon } from "@/src/Icons/WalletIcons";
import { DurationIcon, RecepientIcon } from "@/src/Icons/createChallengeIcons";
import { BellIcon, TrophyIcon } from "@/src/Icons/indexIcons";
import { TotalIcon } from "@/src/Icons/IconTotal";
import { fetchUsdtToEthRate } from "@/context/getPrice/getETHPrice";
import { getWalletData } from '../../context/LocalData/getFromAsync'
import { getBalance } from "@/Web3Module/getBalance";
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

type QueueChallenges = {
  id: string;
  recepeintAddress: string;
  amount: number;
};

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const [load, setLoad] = useState(true);
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showStats, setShowStats] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<string>("0");
  const [expectedMoney, setExpectedMoney] = useState<number>(0);
  const [queueChallenges, setQueueChallenges] = useState<QueueChallenges[]>([]);
  const [walletExist, setWalletExist] = useState<boolean>(false);
  const [createdTransactions, setCreatedTransactions] = useState<
    TransactionCreated[]
  >([]);
  const [AcceptedTransactions, setAcceptedTransactions] = useState<
    TransactionAccepted[]
  >([]);

  const mockData = [
    {
      id: "1",
      recepeintAddress: "0xA1f2b6C98D9eF345aD34Bf3D4B9bB3eF4C9e2A01",
      Status: "Accepted",
    },
    {
      id: "2",
      recepeintAddress: "0x5bC3C90F1F8f1e9A2E2A81e4E4A3C0a2F8Dd2F34",
      Status: "Awaiting",
    },
    {
      id: "3",
      recepeintAddress: "0x8eEdD7F2c3a4Bb7c8C4eE8D6A7A9d9eC2Bc9F2e7",
      Status: "Finished",
    },
    {
      id: "4",
      recepeintAddress: "0xD2e0f9B0cB7c8Ee9a6dF5aCcB6fEeF0b9C4F1B8a",
      Status: "Awaiting",
    },
  ];

  const mockData2 = [
    {
      id: "1",
      recepeintAddress: "0FD234b6C98D9eF345aD34Bf3D4B9bB3eF4C9e2A01",
      Title: "AcDS213sdated",
    },
    {
      id: "2",
      recepeintAddress: "0x5A43C90F1F8f1e9A2E2A81e4E4A3C0a2F8Dd2F34",
      Title: "You have to do",
    },
    {
      id: "3",
      recepeintAddress: "0x8115feEdD7F2c3a4Bb7c8C4eE8D6A7A9d9eC2Bc9F2e7",
      Title: "Suka blady",
    },
    {
      id: "4",
      recepeintAddress: "0xFf321d9B0cB7c8Ee9a6dF5aCcB6fEeF0b9C4F1B8a",
      Title: "Jebanyhujsyukablad",
    },
    {
      id: "5",
      recepeintAddress: "0xFf321d9B0cB7c8Ee9a6dF5aCcB6fEeF0b9C4F1B8a",
      Title: "dsadsaJebyhujsyukablad",
    },
  ];

  const amountData = [
    {
      id: "1",
      recepeintAddress: "0FD234b6C98D9eF345aD34Bf3D4B9bB3eF4C9e2A01",
      amount: 0.015,
    },
    {
      id: "2",
      recepeintAddress: "0x5A43C90F1F8f1e9A2E2A81e4E4A3C0a2F8Dd2F34",
      amount: 0.005,
    },
    {
      id: "3",
      recepeintAddress: "0x8115feEdD7F2c3a4Bb7c8C4eE8D6A7A9d9eC2Bc9F2e",
      amount: 0.02,
    },
  ];

  const getRate = async () => {
    try {
      const rate = await fetchUsdtToEthRate();
      setRate(rate);
    } catch (err) {
      setError("Error while get data");
    }
  };

  const getExpectedTotal = () => {
    const total = queueChallenges.reduce((sum, amount) => {
      return sum + amount.amount;
    }, 0);

    return total;
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user]);

  useEffect(() => {
    setCreatedTransactions(mockData);
    setAcceptedTransactions(mockData2);
    setQueueChallenges(amountData);
    getRate();
    setLoad(false)
  }, []);

  useEffect(() => {
    const total = getExpectedTotal();
    setExpectedMoney(total);
  }, [queueChallenges]);

    useEffect(() => {
    const get = async () => {
        const wallet = await getWalletData();
        if (wallet) {
          const data = await getBalance(wallet.address);
          setCurrentBalance(data);
          setWalletExist(true);
        }
    };

    get();
  }, []);
  
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  if (load) {
    return(
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
        <TouchableOpacity style={[styles.balanceDisplay]}>
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
              <Text
                style={[
                  styles.currentBalance,
                  { fontSize: 12, color: "#c8c8c8" },
                ]}
              >
                Exprected from 3 challenges
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View>
          <TouchableOpacity style={styles.backroudAction}>
            <View style={styles.titleRow}>
              <BellIcon />
              <Text style={styles.currentBalance}>
                {" "}
                3 New Challegens Actions
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
                <Text
                  style={[
                    styles.currentBalance,
                    { fontSize: 12, color: "#c8c8c8" },
                  ]}
                >
                  {" "}
                  Completed 4 task for $149
                </Text>
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
                  onPress={() => console.log("Tapped", item.id)}
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
                    ) : item.Status === "Accepted" ? (
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
                  onPress={() => console.log("Tapped", item.id)}
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
