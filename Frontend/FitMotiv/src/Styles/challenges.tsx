import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleBox: {
    alignItems: "center",
    marginBottom: height * 0.02,
  },

  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "inter",
  },
  exersiceTable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    marginBottom: 20,
    width: width * 0.9,
  },
  exersiceTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "inter",
  },
  exersicePriceBackround: {
    backgroundColor: "#2BC4AD",
    alignSelf: "flex-start",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  exersiceStatusBackround: {
    backgroundColor: "#9A5CEE",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 20,
  },
  TotalText: {
    fontSize: 14,
    color: "white",
    fontWeight: 700,
    fontFamily: "inter",
  },
});
