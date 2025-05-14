import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container:{ 
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  labelRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center"
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
    backgroundColor: 'transparent', 
    color: 'white' ,
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
    marginLeft: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 15,

  },
  DepositButton: {
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    width: 146, 
    height: 50, 
    marginRight: 10, 
    borderRadius: 25,
  },
    buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between', 
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
});














