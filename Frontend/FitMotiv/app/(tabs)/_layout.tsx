import AnimatedTabBar from "../../src/Components/AnimatedTabBar"
import { Tabs } from "expo-router";
import { HomeIcon, ChallangeIcon, WalletIcon } from "../../src/Icons/IconsNavBar";
import CustomHeader from "@/src/Components/Header";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />} 
      screenOptions={{
        headerStyle: { backgroundColor: "transparent" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
          header: () => <CustomHeader backButton={false} />,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Challenges",
          tabBarIcon: ({ focused }) => <ChallangeIcon focused={focused} />,
          header: () => <CustomHeader backButton={false}/>,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ focused }) => <WalletIcon focused={focused} />,
          header: () => <CustomHeader backButton={false} settingsButton={true}/>,
        }}
      />
    </Tabs>
  );
}
