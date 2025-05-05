import useAuth from "@/context/authContext/auth";
import CustomHeader from "@/src/Components/Header";
import { Redirect, Stack, Href, router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        style="light"
        backgroundColor="#121212"
        translucent={true}
        hideTransitionAnimation="fade"
      />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />

        <Stack.Screen
          name="challengeDetail/[id]"
          options={{
            headerShown: true,
            header: () => <CustomHeader backButton={true} />,
          }}
        />
      </Stack>
    </>
  );
}
