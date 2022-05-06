import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useState } from "react";
import { IconButton, useTheme } from "react-native-paper";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  BounceIn,
  Easing,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// const webApp = Platform.select({ web: true, default: false });

export const TABBAR_HEIGHT = 50;

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  // const routeName = state.routes[state.index].name;

  // const tabBarStyle: any =
  //   descriptors[state.routes[state.index].key].options.tabBarStyle;

  return (
    <View
      style={[
        styles.tabBarStyles,

        {
          width: 0.9 * width,
          elevation: 5,
          backgroundColor: theme.colors.primary,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const scale = useSharedValue(1);
        const opacity = useSharedValue(1);

        const rAnimatedIcon = useAnimatedStyle(() => {
          return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
          };
        });

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          scale.value = withSequence(withSpring(0.8), withSpring(1));
          opacity.value = withSequence(
            withTiming(0.5, { duration: 100 }),
            withTiming(1)
          );

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View key={route.key} style={[styles.container]}>
            <Pressable
              style={styles.pressable}
              onPress={onPress}
              // onPressIn={() => {
              //   scale.value = withSpring(0.8);
              // }}
              // onPressOut={() => {
              //   scale.value = withSpring(1);
              // }}
            >
              <Animated.View style={[styles.iconContainer, rAnimatedIcon]}>
                {options.tabBarIcon
                  ? options.tabBarIcon({
                      color: "white",
                      focused: isFocused,
                      size: 24,
                    })
                  : null}
                {
                  <Text
                    style={[
                      styles.textStyles,
                      { display: isFocused ? "flex" : "none" },
                    ]}
                  >
                    {label}
                  </Text>
                }
              </Animated.View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarStyles: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    height: TABBAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
    marginHorizontal: 15,
    borderRadius: 15,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyles: {
    fontFamily: "SourceSansProRegular",
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});
