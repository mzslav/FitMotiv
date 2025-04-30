import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const header = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',  
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingTop: 40, 
    paddingHorizontal: 20, 
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  backButtonText: {
    color: '#fff',  
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});
