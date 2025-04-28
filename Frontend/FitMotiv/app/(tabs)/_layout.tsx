import AnimatedTabBar from "../../src/Components/AnimatedTabBar"
import { Tabs } from "expo-router";
import { HomeIcon, ChallangeIcon, WalletIcon } from "../../src/Icons/IconsNavBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />} 
      screenOptions={{
        headerStyle: { backgroundColor: "#25292e" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Challenges",
          tabBarIcon: ({ focused }) => <ChallangeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ focused }) => <WalletIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}
