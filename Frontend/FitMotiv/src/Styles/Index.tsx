import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container:{ 
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40, 
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
  buttonContainer: {
    borderRadius: 25,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

});
