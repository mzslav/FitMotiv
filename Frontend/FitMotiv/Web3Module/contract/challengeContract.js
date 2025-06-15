import { Wallet, Contract, JsonRpcProvider, parseEther } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import abi from "./abi.json";

const INFURA_KEY = process.env.EXPO_PUBLIC_INFURA_API;
const CONTRACT_ADDRESS = "0xd6A28e0188538e20715631575b54E7627AC5b8Ab";

const provider = new JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_KEY}`
);

export const getContract = async () => {
  try {
    const mnemonic = await AsyncStorage.getItem("Seed-Phrase");
    if (!mnemonic) throw new Error("Mnemonic not found");

    const wallet = Wallet.fromPhrase(mnemonic);
    const signer = wallet.connect(provider);

    const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
    return contract;
  } catch (err) {
    console.error("Contract init error:", err);
    return null;
  }
};
