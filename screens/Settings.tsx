import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  Switch,
  useTheme,
  Appbar,
  IconButton,
  Colors,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/auth";
import { DarkTheme, DefaultTheme, ThemeContext } from "../utils/customTheme";
import { ListItem } from "../components/ListItem";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BottomTabBarProps } from "./Home";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomHeader } from "../components/CustomHeader";

const Settings = ({ navigation }: BottomTabBarProps) => {
  const dispatch = useDispatch();

  const { toggleTheme, isDarkTheme } = useContext(ThemeContext);

  const theme = useTheme();

  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader navigation={navigation} title="Settings" />
      <ListItem
        id="1"
        textStyles={[styles.textStyles, { color: theme.colors.text }]}
        title="Logout from Device"
        onPress={() => logoutUser()}
        children={
          <Ionicons name="exit" color={theme.colors.accent} size={24} />
        }
      />
      <ListItem
        id="2"
        textStyles={[styles.textStyles, { color: theme.colors.text }]}
        title="Dark Mode"
        touchable={false}
        children={<Switch value={isDarkTheme} onValueChange={toggleTheme} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textStyles: {
    fontSize: 15,
  },
});

export default Settings;
