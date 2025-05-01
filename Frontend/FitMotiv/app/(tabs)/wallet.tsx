import "react-native-get-random-values";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
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

export default function WalletScreen() {
  const { user, loading } = useAuth();
  const [walletExist, setWalletExist] = useState("false");
  const [address, setAddress] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);

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
    } catch (e) {}
  };

  const handelCreateWallet = async () => {
    setLoadingCreate(true);
    try {
      const wallet = ethers.Wallet.createRandom();
      console.log("Wallet generated:", wallet.address);
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
        </View>
      </View>
    );
  }
}
