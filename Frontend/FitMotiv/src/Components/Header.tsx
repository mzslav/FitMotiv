import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { header as styles } from "../Styles/header"; 

const CustomHeader = ({ height = 82, backgroundColor = '#121212', backButton = false }) => {
    return (
      <View style={[styles.header, { height, backgroundColor }]}>
        {backButton ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text> 
          </TouchableOpacity>
        ) : (
          <Text style={styles.headerText}>FITMOTIV</Text>
        )}
      </View>
    );
};

export default CustomHeader;
