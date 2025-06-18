import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { header as styles } from "../Styles/header"; 
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { BackIcon, SettingsIcon } from "../Icons/IconHeader";

const LogoText = () => {
  return (
    <View style={styles.container}>
      <MaskedView
        maskElement={
          <Text style={[styles.textBase, { backgroundColor: "transparent" }]}>
            FIT
          </Text>
        }
      >
        <LinearGradient
          colors={["#EEEEEE", "#BABABA", "#888888"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.textBase, { opacity: 0 }]}>FIT</Text>
        </LinearGradient>
      </MaskedView>

      <MaskedView
        maskElement={
          <Text style={[styles.textBase, { backgroundColor: "transparent" }]}>
            MOTIV
          </Text>
        }
      >
        <LinearGradient
          colors={["#6412DF", "#CDA2FB"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.textBase, { opacity: 0 }]}>MOTIV</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
};

const CustomHeader = ({ height = 92, backgroundColor = '#121212', backButton = false, settingsButton = false }) => {
  return (
    <View style={[styles.header, { height, backgroundColor }]}>
      <LogoText />

      {backButton && (
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
      )}
      {settingsButton && (
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <SettingsIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomHeader;
