import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  labelRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "white",
    fontWeight: 700,
    marginLeft: 5,
  },
  textInputBackround: {
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    height: height * 0.05,
    justifyContent: "center",
  },
  textInput: {
    backgroundColor: "transparent",
    color: "white",
  },
  opacityButton: {
    backgroundColor: "#121212",
    height: 50,
    width: 146,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    borderColor: "#C8C8C8",
    borderWidth: 1,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
  },
  DepositButton: {
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    width: 146,
    height: 50,
    borderRadius: 25,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonGradient: {
    backgroundColor: "#9A5CEE",
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    position: "relative",
  },
  buttonGradientText: {
    justifyContent: "center",
    textAlign: "center",
    fontSize: 14,
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
  exercisesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  exerciseSquereIsPressed: {
    backgroundColor: "#9A5CEE",
    width: 65,
    height: 65,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseSquere: {
    backgroundColor: "#1e1e1e",
    width: 65,
    height: 65,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  exerciseTitle: {
    fontSize: 12,
    color: "#747474",
    fontWeight: 700,
    marginTop: 3,
  },
  durationBackround: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  durationTitle: {
    fontSize: 12,
    color: "white",
    fontWeight: 700,
  },

  modalSendMenu: {
    flexDirection: "column",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  modalTitelContainer: {},
  containerGradientInfo: {
    backgroundColor: "#9A5CEE",
    width: width * 0.9,
    height: height * 0.1,
    alignItems: "center",
    borderRadius: 20,
    marginTop: 60,
    justifyContent: "center",
  },
  modalText: {
    color: "white",
    fontWeight: 700,
    fontSize: 24,
    fontFamily: "inter",
    textAlign: "center",
  },
  modalInfoContainer: {
    width: width * 0.9,
    height: height * 0.65,
    borderRadius: 15,
    backgroundColor: "#1E1E1E",
  },
  dataColumn: {
    flexDirection: "column",
    marginLeft: 20,
    marginTop: 20,
  },
  titleRow: {
    flexDirection: "row",
  },
  titleText: {
    color: "#747474",
    fontSize: 14,
    fontWeight: 700,
    marginLeft: 5,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    marginTop: 5,
  },
});
