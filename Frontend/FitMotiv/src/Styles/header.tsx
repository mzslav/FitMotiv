import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const header = StyleSheet.create({
  container:{ 
    fontWeight: "bold",
    fontSize: 18,
    flexDirection: "row",
  },
  textBase: {
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    width: '100%',
    flexDirection: 'row',  
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingTop: 40, 
    paddingHorizontal: 30, 
    display: "flex",
  },

  backButtonText: {
    color: '#fff',  
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});
