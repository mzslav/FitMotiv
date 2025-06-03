import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: "flex-start",
    alignItems: "center"
  },
  buttonWrapper: {
    width: "50%",
    alignItems: "center",
    paddingBottom: 5,
    paddingTop: 5,
  },
  buttonGradient: {
    backgroundColor: "#9A5CEE",
    height: height * 0.06,
    width: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    position: "relative",
  },
  buttonGradientText: {
    justifyContent: "center",
    textAlign: "center",
    fontSize: 20,
    color: "#C8C8C8",
    fontWeight: "bold",
    fontFamily: "inter",
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  procent: {
    color: "#C8C8C8",
    fontSize: 14,
    fontWeight: 700,
  },
  ExerciseTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "inter",
    fontWeight: 700,
  },

    backRoundIconExercise: {
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    width: 70,
    height: 70,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  ExerciseRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  statExercise: {
    width: width * 0.9,
    marginTop: 10,
  },
  webViewContainer: {
    width: width * 0.9,
    height: height * 0.75,
    marginTop: height * 0.05,
  },
  buttonRow: {
    flexDirection: "row",
  },
  opacityButton: {
    backgroundColor: "#121212",
    height: height * 0.06,
    width: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    borderColor: "#C8C8C8",
    borderWidth: 1,
  },
  titleExercise: {
    color: "#C8C8C8",
    fontSize: 16,
    fontWeight: 700,
  }
})
