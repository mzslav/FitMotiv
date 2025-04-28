import { Text, View, StyleSheet, Button } from 'react-native';
import { Link, router } from 'expo-router'; 
import { Image } from 'expo-image';
import { Redirect } from 'expo-router';

export default function Index() {
  
  return ( 

    <Button title='go to login' onPress={ () => router.push("/auth/login")}/>
  );
}

