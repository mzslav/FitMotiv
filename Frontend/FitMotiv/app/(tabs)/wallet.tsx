import "react-native-get-random-values";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { styles as styles } from "../../src/Styles/wallet";
import { LinearGradient } from "expo-linear-gradient";
import { ethers } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WalletIcon } from "@/src/Icons/IconsNavBar";
import { BalanceIcon } from "@/src/Icons/WalletIcons";

export default function WalletScreen() {
  const { user, loading } = useAuth();
  const [walletExist, setWalletExist] = useState("false");
  const [address, setAddress] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [balance, setBalance] = useState("0.012");
  const [usdBalance, setUsdBalance] = useState("1523");
  useEffect(() => {
    checkAdressData();
  }, [walletExist]);

  const checkAdressData = async () => {
    try {
      const mnemonic = await AsyncStorage.getItem("Seed-Phrase");
      const address = await AsyncStorage.getItem("Wallet-Address");
      if (address !== null && mnemonic !== null) {
        setAddress(address);
        setMnemonic(mnemonic);
        setWalletExist("true");
      }
    } catch (e) { }
  };

  const handelCreateWallet = async () => {
    setLoadingCreate(true);
    try {
      const wallet = ethers.Wallet.createRandom();
      setAddress(wallet.address);
      if (!wallet.mnemonic) throw new Error("Can't create seed-phrase");
      setMnemonic(wallet.mnemonic.phrase);
      setWalletExist("onConfirm");
    } catch (e) {
      console.error("Error in handelCreateWallet:", e);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleWithdraw = async () => { };

  const handleDeposit = async () => { };

  const onConfirm = async () => {
    try {
      await AsyncStorage.setItem("Seed-Phrase", mnemonic);
      await AsyncStorage.setItem("Wallet-Address", address);
      setWalletExist("true");
      Alert.alert("Seed-Phrase and Address saved to AsyncStorage");
    } catch (e) {
      Alert.alert(`Error saving Seed-Phrase:, ${e}`);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return null;
  }

  if (walletExist == "false") {
    return (
      <View style={styles.container}>
        <Text style={styles.InfoText}>
          {" "}
          To use FITMOTIV you have to create new crypto wallet{" "}
        </Text>
        <View>
          {loadingCreate ? (
            <ActivityIndicator size={"large"} color="#6412DF" />
          ) : (
            <TouchableOpacity
              onPress={handelCreateWallet}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={["#6412DF", "#CDA2FB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 0.9]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonGradientText}>Create Wallet</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  } else if (walletExist === "onConfirm") {
    return (
      <View style={styles.container}>
        <View style={styles.cryptoInfo}>
          <Text style={styles.label}>Your address</Text>
          <TouchableOpacity
            style={styles.newAddressConteiner}
            onPress={() => {
              Clipboard.setString(address);
            }}
          >
            <Text style={styles.newAddress}> {address} </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Your seed-phrase</Text>
          <TouchableOpacity
            style={styles.newAddressConteiner}
            onPress={() => {
              Clipboard.setString(mnemonic);
            }}
          >
            <Text style={styles.InfoText}>
              {mnemonic.split(" ").map((word, index) => (
                <Text style={styles.newAddress} key={index}>
                  {word}{" "}
                </Text>
              ))}
            </Text>
          </TouchableOpacity>

          <Text style={styles.InfoText}>
            Copy this data to access the wallet
          </Text>
        </View>
        <TouchableOpacity onPress={onConfirm} style={styles.buttonContainer}>
          <LinearGradient
            colors={["#6412DF", "#CDA2FB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 0.9]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonGradientText}>Confirm</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { justifyContent: "flex-start" }]}>
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
              <Text style={styles.currentBalance}>Current balance</Text>
            </View>
            <Text style={styles.balanceETH}>{balance} ETH</Text>
            <Text style={styles.balanceUSD}>= ${usdBalance}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={handleDeposit}
            style={styles.DepositButton}
          >
            <LinearGradient
              colors={["#6412DF", "#CDA2FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.9]}
              style={[styles.buttonGradient]}
            >
              <Text style={[styles.buttonGradientText, { marginRight: 154 }]}>
                Deposit
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleWithdraw}
            style={styles.opacityButton}
          >
            <Text style={styles.buttonGradientText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <Text style={[styles.balanceUSD, { fontSize: 14, alignSelf: "flex-start", marginLeft: 25, paddingBottom: 10 }]}>
            Transactions History
          </Text>
          <ScrollView style={styles.transactionsContainer}>
          <TouchableOpacity style={styles.transactionItem}>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionItemText}>Transaction 1:</Text>
              <Text style={styles.transactionItemText}>Sent $50 to John</Text>
            </View>
          </TouchableOpacity>
          </ScrollView>

        </View>
      </View>
    );
  }
}
