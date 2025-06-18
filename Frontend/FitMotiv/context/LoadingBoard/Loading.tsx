import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

type LoadingScreenProps = {
  visible: boolean;
};

export default function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
