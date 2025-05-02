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
  
  balanceDisplay: {
    width: width * 0.9,
    height: height * 0.2,
    justifyContent: "center",
    alignContent: "flex-start"
  },

  containerGradient:{
    backgroundColor: "#9A5CEE",
    width: width * 0.9,
    height: height * 0.2,
    alignItems: "flex-start", 
    flexDirection: "column",
    borderRadius: 20,
    position: "relative",
    paddingLeft: 30,
    paddingTop: 20,
  },
  
  balanceETH: {
    color: "white",
    fontSize: 32,
    fontWeight: "700", 
    paddingBottom: 5,
  },
  balanceUSD: {
    color: "#C8C8C8",
    fontSize: 16,
    fontWeight: "700", 

  },
  currentBalance: {
    color: "white",
    fontSize: 16,
    fontWeight: "700", 
    marginLeft: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
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
  historyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionsContainer: {
    width: width * 0.9,
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    maxHeight: 300, 
    
  },  
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  transactionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingHorizontal: 25,
  },
  transactionItemText: {
    color: "white",
    fontWeight: 700,
  }


});
