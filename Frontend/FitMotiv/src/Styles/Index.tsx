import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 20,
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

  balanceDisplay: {
    width: width * 0.9,
    height: height * 0.2,
    justifyContent: "center",
    alignContent: "flex-start",
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
  },

  containerGradient: {
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
    marginRight: 10,
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
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
  },
  exersicePriceBackround: {
    backgroundColor: "#2BC4AD",
    alignSelf: "center",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  balanceBonus: {
    color: "white",
    fontSize: 16,
    fontWeight: 700,
  },

  backroudAction: {
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    alignContent: "stretch",
    marginTop: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
challengesRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 25,
},
tabItem: {
  flex: 1,
  alignItems: "center",
},
tabButton: {
  width: '100%',
  alignItems: "center",
},
isActiveSection: {
  fontSize: 20,
  fontWeight: 700,
  color: "#9A5CEE",
},
isNoActiveSection: {
  fontSize: 20,
  fontWeight: 700,
  color: "#747474",
},
activeLine: {
  width: '90%', 
  height: 2, 
  backgroundColor: '#9A5CEE', 
  borderRadius: 1,
  marginTop: 5,
},
NoActiveLine: {
  width: '90%', 
  height: 2, 
  backgroundColor: '#747474', 
  borderRadius: 2,
  marginTop: 5,
},

transactionsContainer: {
    marginTop: 10,
    width: width * 0.9,
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    maxHeight: 150, 
    
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
    fontSize: 14,
    fontFamily: "inter",
  },
  transactionItemTextAwaiting: {
    color: "#FFF",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inter",
  },
  transactionItemTextFinished: {
    color: "#747474",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inter",
  },
    transactionItemTextAccepted: {
    color: "#2BC4AD",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inter",
  },
    TotalText: {
    fontSize: 14,
    color: "white",
    fontWeight: 700,
    fontFamily: "inter",
    
  },
  totalContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
