import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import useAuth from "@/context/authContext/auth";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { styles as styles } from "../../src/Styles/Index";
import { LinearGradient } from "expo-linear-gradient";
import { BalanceIcon } from "@/src/Icons/WalletIcons";
import { DurationIcon } from "@/src/Icons/createChallengeIcons";
import { BellIcon, TrophyIcon } from "@/src/Icons/indexIcons";

export default function IndexScreen() {
  const { user, loading } = useAuth();

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
              <Text style={styles.balanceETH}>=$149</Text>
              <View style={styles.exersicePriceBackround}>
                <Text style={styles.balanceBonus}>+$14</Text>
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
          <Text style={styles.currentBalance}> 3 New Challegens Actions</Text>
            </View>
          </TouchableOpacity>
        </View>

                <View>
          <TouchableOpacity style={styles.backroudAction}>
           <View style={styles.titleRow}>
          <TrophyIcon />
          <View style={{flexDirection: 'column'}}>
          <Text style={styles.currentBalance}> My Achivments</Text>
          <Text style={[
                  styles.currentBalance,
                  { fontSize: 12, color: "#c8c8c8" },
                ]}> Completed 4 task for $149</Text>
          </View>
            </View>
          </TouchableOpacity>
        </View>

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
