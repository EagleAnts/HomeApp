import { StyleSheet, Platform } from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

export default StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    paddingTop: StatusBarHeight,
  },
});
