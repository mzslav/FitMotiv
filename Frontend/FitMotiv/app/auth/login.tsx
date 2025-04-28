import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';


export default function LoginScreen() {
    const router = useRouter()

    return (
        <View>
            <Text> Login Page </Text>
            <Button title='Login' onPress = {() => router.push('/challenges')}/>
        </View>
    )
}