import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { HomeIcon, ChallangeIcon, WalletIcon } from "../Icons/IconsNavBar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const TABS = [
  { name: "index", icon: HomeIcon },
  { name: "challenges", icon: ChallangeIcon },
  { name: "wallet", icon: WalletIcon },
];

export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const indicatorPosition = useSharedValue(0);
  const indicatorScale = useSharedValue(1);
  const indicatorRotation = useSharedValue(0);
  const tabWidth = width / state.routes.length;
  const insets = useSafeAreaInsets();

  const getTabCenterPosition = (index) => {
    return index * tabWidth + tabWidth / 2 - 22;
  };

  useEffect(() => {
    indicatorPosition.value = withTiming(getTabCenterPosition(state.index), {
      damping: 13,
      stiffness: 90,
    });
    
    indicatorScale.value = withSequence(
      withTiming(0.8, { duration: 120 }),
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );
    
    indicatorRotation.value = withSequence(
      withTiming(0.1, { duration: 100 }),
      withTiming(-0.1, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: indicatorPosition.value },
      { scale: indicatorScale.value },
      { rotate: `${indicatorRotation.value}rad` }
    ],
  }));

  return (
    <View style={{
      flexDirection: "row",
      height: 82 + insets.bottom,
      backgroundColor: "#1E1E1E", 
      paddingBottom: insets.bottom,
    }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 7,
            width: 44,
            height: 44,
            borderRadius: 22, 
            overflow: "hidden",
            zIndex: 0,
          },
          indicatorStyle,
        ]}
      >
        <LinearGradient
          colors={["#6412DF", "#CDA2FB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0,0.9]}
          style={{ width: "100%", height: "100%" }}
        />
      </Animated.View>

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;
        const IconComponent = TABS.find(tab => tab.name === route.name)?.icon;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const textOpacity = useSharedValue(isFocused ? 1 : 0.6);
        const textScale = useSharedValue(isFocused ? 1 : 0.9);

        useEffect(() => {
          if (isFocused) {
            textOpacity.value = withTiming(1, { duration: 200 });
            textScale.value = withSequence(
              withTiming(1.1, { duration: 150 }),
              withTiming(1, { duration: 100 })
            );
          } else {
            textOpacity.value = withTiming(0.6, { duration: 200 });
            textScale.value = withTiming(0.9, { duration: 150 });
          }
        }, [isFocused]);

        const textStyle = useAnimatedStyle(() => ({
          opacity: textOpacity.value,
          transform: [{ scale: textScale.value }],
        }));

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 11,
              zIndex: 1,
            }}
          >
            {IconComponent && <IconComponent focused={isFocused} />}
            <Animated.Text style={[
              {
                marginTop: 10,
                color: isFocused ? "#C8C8C8" : "#747474",
                fontSize: 12,
                fontFamily: "Inter",
              },
              textStyle
            ]}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}