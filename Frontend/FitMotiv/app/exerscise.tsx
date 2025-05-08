import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import useAuth from "@/context/authContext/auth";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "react-native-paper";

export default function ExerciseScreen() {
  const { user, loading } = useAuth();
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }

    // Setup timer
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev < 120) { // 2 minutes
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, user]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#9A5CEE" />;
  }

  if (!user) {
    return null;
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container}><Text style={styles.text}>Requesting camera permission...</Text></View>;
  }
  
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = Math.min(timer / 120, 1); 


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Camera header */}
      <View style={styles.header}>
        <Text style={styles.cameraText}>Camera</Text>
      </View>
      
      {/* Main camera container */}
      <View style={styles.cameraContainer}>
        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
        
        {/* Camera preview */}
        <CameraView style={styles.camera} facing={facing}>
          {/* Exercise content can be overlaid here */}
        </CameraView>
        
        {/* Exercise controls and progress */}
        <View style={styles.exerciseControlsContainer}>
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseIconContainer}>
              <Text style={styles.exerciseIconText}>🧘</Text>
            </View>
            <View style={styles.exerciseInfoContainer}>
              <Text style={styles.exerciseTitle}>Plank 2 min</Text>
              <Text style={styles.exercisePercentage}>90%</Text>
            </View>
          </View>
          
          <ProgressBar
            progress={0.9}
            color="#9A5CEE"
            style={styles.progressBar}
          />
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.finishedButton}>
              <Text style={styles.finishedButtonText}>Finished</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  cameraText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#939393',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
    margin: 10,
    position: 'relative',
  },
  camera: {
    flex: 1,
    backgroundColor: '#F8F5F2', // Light background to match image
  },
  timerContainer: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
    padding: 5,
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseIconContainer: {
    backgroundColor: '#333',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  exerciseIconText: {
    fontSize: 20,
  },
  exerciseInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercisePercentage: {
    color: 'white',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '45%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  finishedButton: {
    backgroundColor: '#9A5CEE',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '45%',
    alignItems: 'center',
  },
  finishedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    margin: 20,
  },
  permissionButton: {
    backgroundColor: '#9A5CEE',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginHorizontal: 50,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});