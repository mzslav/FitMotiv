import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import useAuth from '@/context/authContext/auth';
import { router } from 'expo-router';
import { useEffect } from 'react';


export default function AboutScreen() {

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
      <View style={styles.container}>
        <Text style={styles.text}>About screen1</Text>
      </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
