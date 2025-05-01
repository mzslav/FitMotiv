import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const storeToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("UserToken", token);
    } catch (e) {
      console.log("Error saving token:", e);
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("UserToken");
    } catch (e) {
      console.log("Error removing token:", e);
    }
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        await storeToken(token);
      } else {
        setUser(null);
        await removeToken();
      }
      setLoading(false);
    });

    return unSub;
  }, []);

  return { user, loading };
}
