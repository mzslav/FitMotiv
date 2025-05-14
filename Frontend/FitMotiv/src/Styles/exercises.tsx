import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
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
    backgroundColor: '#F8F5F2', 
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
})
