import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container:{ 
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 12,
  },
  InfoText:{
    marginHorizontal: 50,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "inter",
    color: "#747474",
    fontSize: 10,
    
    
  },
  label:{
    color: "white",
    fontSize: 18,
    marginTop: 16,
    marginBottom: 5,
    
  },
  newAddress:{
    color: "white",
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: "center",

  },
  newAddressConteiner: {
    alignItems: "center",
    backgroundColor: '#121212', 
    padding: 8,
    borderRadius: 15,
    marginHorizontal: 10,
  
  },
  cryptoInfo:{
    width: width * 0.9,
    height: height * 0.5,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },


});
