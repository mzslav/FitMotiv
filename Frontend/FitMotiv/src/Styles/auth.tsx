import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const auth = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingHorizontal: width * 0.05,
  },
  titleBox: {
    paddingTop: height * 0.1,
    alignItems: "center",
    marginBottom: height * 0.02,
  },

  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "inter",
  },
  inputs: {
    paddingTop: height * 0.04,
  },
  description: {
    fontSize: 12,
    color: "#D0CDCD",
    paddingBottom: 5,
    fontWeight: "bold",
    fontFamily: "inter",
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#C8C8C8",
    height: 50,
    width: 300,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontWeight: "bold",
    fontFamily: "inter",
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
    fontSize: 20,
    color: "#C8C8C8",
    fontWeight: "bold",
    fontFamily: "inter",
  },
  opacityButton: {
    backgroundColor: "#121212",
    height: 50,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    borderColor: "#C8C8C8",
    borderWidth: 1,
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});
