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
  Modal,
  TextInput,
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
import { ethers, HDNodeWallet } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WalletIcon } from "@/src/Icons/IconsNavBar";
import { fetchUsdtToEthRate } from "@/context/getPrice/getETHPrice";
import {
  BalanceIcon,
  RecipientIcon,
  NetworkIcon,
  CoinsIcon,
  BigRecipientIcon,
} from "@/src/Icons/WalletIcons";

type Transaction = {
  id: string;
  type: string;
  amount: number;
};

export default function WalletScreen() {
  const currentUser = auth.currentUser;
  const { user, loading } = useAuth();
  const [walletExist, setWalletExist] = useState("false");
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [address, setAddress] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDepositVisible, setModalDepositVisible] = useState(false);
  const [balance, setBalance] = useState("0.012");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addressToWithdraw, setAddressToWithdraw] = useState<string>("");
  const [amountToWithdraw, setAmountToWithdraw] = useState<number | null>(null);

  const [mnemonicInput, setMnemonicInput] = useState<string>("");

  const apiPort = process.env.EXPO_PUBLIC_SERVER_HOST;

  useEffect(() => {
    checkAdressData();
  }, [walletExist]);

  const mockTransactions = [
    { id: "1", type: "Withdraw", amount: 0.02 },
    { id: "2", type: "Deposit", amount: 0.15 },
    { id: "3", type: "Challenge Completed", amount: 1.0 },
    { id: "4", type: "Challenge Created", amount: 0.1 },
    { id: "5", type: "Deposit", amount: 0.95 },
    { id: "6", type: "Challenge Completed", amount: 1.1 },
    { id: "7", type: "Withdraw", amount: 0.002 },
    { id: "8", type: "Deposit", amount: 0.0015 },
    { id: "9", type: "Challenge Completed", amount: 10 },
  ];

  const getRate = async () => {
    try {
      const rate = await fetchUsdtToEthRate();
      setRate(rate);
    } catch (err) {
      setError("Error while get data");
    }
  };

  useEffect(() => {
    setTransactions(mockTransactions);
    getRate();
  }, []);

  const checkAdressData = async () => {
    if (walletExist !== "true") {
      try {
        const mnemonic = await AsyncStorage.getItem("Seed-Phrase");
        const address = await AsyncStorage.getItem("Wallet-Address");

        if (address !== null && mnemonic !== null) {
          setAddress(address);
          setMnemonic(mnemonic);
          setWalletExist("true");
        } else if (walletExist == "onConfirm") {
        } else {
          fetchWalletAddress();
        }
      } catch (e) {}
    }
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

  const handleLoginWithMnemonic = async (mnemonicPhrase: string) => {
    try {
      const wallet = HDNodeWallet.fromPhrase(mnemonicPhrase.trim());
      setMnemonic(wallet.mnemonic?.phrase || "");
      await AsyncStorage.setItem("Seed-Phrase", mnemonicPhrase);
      Alert.alert("Seed-Phrase saved to AsyncStorage");
      setWalletExist("true");
    } catch (e) {
      console.error("Error logging in via seed phrase:", e);
      alert("Invalid or incorrect seed phrase");
    }
  };

  const handleWithdraw = () => {
    setModalVisible(true);
  };

  const onWithdraw = () => {
    console.log("Try to withdraw!!");
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleCloseDeposit = () => {
    setModalDepositVisible(false);
  };

  const handleDeposit = async () => {
    setModalDepositVisible(true);
  };

  const fetchWalletAddress = async () => {
    if (!currentUser) {
      console.log("No user is signed in");
      return;
    }
    const token = await currentUser.getIdToken();

    let response = await fetch(`${apiPort}/profile/getAddress`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("HTTP Error " + response.status);
    }

    const data = await response.json();
    const addressData = data.address;
    if (addressData !== null) {
      await AsyncStorage.setItem("Wallet-Address", addressData);
      setAddress(addressData);
      setWalletExist("loggedIn");
      Alert.alert("Address saved to AsyncStorage");
    } else {
      setWalletExist("false");
    }
  };

  const saveWalletAddress = async () => {
    if (!currentUser) {
      console.log("No user is signed in");
      return;
    }
    const token = await currentUser.getIdToken();

    let response = await fetch(`${apiPort}/profile/createWallet`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: address }),
    });

    if (!response.ok) {
      alert("HTTP Error " + response.status);
    }
  };

  const onConfirm = async () => {
    try {
      await AsyncStorage.setItem("Seed-Phrase", mnemonic);
      await AsyncStorage.setItem("Wallet-Address", address);
      saveWalletAddress();
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
  } else if (walletExist == "loggedIn") {
    return (
      <View style={[styles.container, { justifyContent: "flex-start" }]}>
        <TextInput
          placeholder="Enter your mnemonic"
          style={styles.newAddress}
          value={mnemonicInput}
          onChangeText={setMnemonicInput}
          placeholderTextColor="#747474"
        />

        <TouchableOpacity
          onPress={() => handleLoginWithMnemonic(mnemonicInput)}
          style={styles.buttonContainer}
        >
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
            {rate !== null ? (
              <Text style={styles.balanceUSD}>
                ≈ ${(parseFloat(balance) / rate).toFixed(2)}
              </Text>
            ) : (
              <Text style={styles.balanceETH}>Loading...</Text>
            )}
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

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
          >
            <View style={styles.modalOverlay}>
              <LinearGradient
                colors={["#6412DF", "#CDA2FB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 0.9]}
                style={styles.containerGradientInfo}
              >
                <Text style={styles.modalText}>Withdraw your funds</Text>
              </LinearGradient>

              <View style={styles.modalDataContainer}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ marginTop: 16, marginBottom: 5 }}>
                    <View style={styles.titleRow}>
                      <RecipientIcon />
                      <Text style={styles.titleText}>Recepient</Text>
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity style={[styles.newAddressConteiner]}>
                      <TextInput
                        placeholder="Enter recipient address"
                        style={styles.newAddress}
                        value={addressToWithdraw}
                        onChangeText={setAddressToWithdraw}
                        placeholderTextColor="#747474"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ alignItems: "center", marginTop: 15 }}>
                  <View style={{ marginTop: 16, marginBottom: 5 }}>
                    <View style={styles.titleRow}>
                      <CoinsIcon />
                      <Text style={styles.titleText}>Amount Coins</Text>
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.newAddressConteiner}>
                      <TextInput
                        placeholder="Enter amount coins"
                        style={styles.newAddress}
                        placeholderTextColor="#747474"
                        value={
                          amountToWithdraw !== null
                            ? amountToWithdraw.toString()
                            : ""
                        }
                        onChangeText={(text) => {
                          const onlyNumbers = text.replace(/[^0-9]/g, "");
                          const asNumber =
                            onlyNumbers === ""
                              ? null
                              : parseInt(onlyNumbers, 10);
                          setAmountToWithdraw(asNumber);
                        }}
                        keyboardType="numeric"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={[
                      styles.titleText,
                      { color: "#747474", marginTop: 5 },
                    ]}
                  >
                    {rate !== null && amountToWithdraw !== null
                      ? `≈ ${(amountToWithdraw / rate).toFixed(3)}`
                      : ``}
                  </Text>
                </View>
                <View style={[styles.titleRow, { marginTop: 10 }]}>
                  <Text style={[styles.titleText, { color: "#747474" }]}>
                    Current Wallet Balance
                  </Text>
                  <Text style={[styles.titleText]}>{balance} ETH</Text>
                </View>

                <View style={[styles.titleRow, { marginTop: 30 }]}>
                  <NetworkIcon />
                  <Text style={[styles.titleText, { color: "#747474" }]}>
                    Network
                  </Text>
                </View>
                <Text style={[styles.titleText, { fontSize: 16 }]}>
                  ETH Sepolia
                </Text>
              </View>
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  onPress={onWithdraw}
                  style={styles.DepositButton}
                >
                  <LinearGradient
                    colors={["#6412DF", "#CDA2FB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0, 0.9]}
                    style={[styles.buttonGradient]}
                  >
                    <Text
                      style={[styles.buttonGradientText, { marginRight: 154 }]}
                    >
                      Confirm
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleClose}
                  style={[styles.opacityButton]}
                >
                  <Text style={styles.buttonGradientText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={modalDepositVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCloseDeposit}
          >
            <View style={[styles.modalOverlay]}>
              <LinearGradient
                colors={["#6412DF", "#CDA2FB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 0.9]}
                style={styles.containerGradientInfo}
              >
                <Text style={styles.modalText}>Your data for deposit</Text>
              </LinearGradient>

              <View style={[styles.modalDataContainer]}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ marginTop: 16, marginBottom: 5 }}>
                    <View style={styles.titleRow}>
                      <View style={{ marginTop: 5 }}>
                        <BigRecipientIcon />
                      </View>
                      <Text style={[styles.titleText, { fontSize: 26 }]}>
                        Your wallet address
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ alignItems: "center", marginTop: 65 }}>
                  <TouchableOpacity
                    style={styles.newAddressConteiner}
                    onPress={() => {
                      Clipboard.setString(address);
                    }}
                  >
                    <Text style={styles.newAddress}> {address} </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.titleRow, { marginTop: 30 }]}>
                  <NetworkIcon />
                  <Text style={[styles.titleText, { color: "#747474" }]}>
                    Network
                  </Text>
                </View>
                <Text style={[styles.titleText, { fontSize: 16 }]}>
                  ETH Sepolia
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCloseDeposit}
                style={[styles.opacityButton, { marginTop: 20 }]}
              >
                <Text style={styles.buttonGradientText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

        <View style={styles.historyContainer}>
          <Text
            style={[
              styles.balanceUSD,
              {
                fontSize: 14,
                alignSelf: "flex-start",
                marginLeft: 25,
                paddingBottom: 10,
              },
            ]}
          >
            Transactions History
          </Text>
          <ScrollView style={styles.transactionsContainer}>
            {transactions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.transactionItem}
                onPress={() => console.log("Tapped", item.id)}
              >
                <View style={styles.transactionRow}>
                  <Text style={styles.transactionItemText}>{item.type}</Text>
                  {item.type == "Withdraw" ||
                  item.type == "Challenge Created" ? (
                    <Text style={styles.transactionItemTextNegative}>
                      -{item.amount} ETH
                    </Text>
                  ) : (
                    <Text style={styles.transactionItemTextPositive}>
                      +{item.amount} ETH
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}
