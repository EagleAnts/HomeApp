import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";

export const useLoading = () => {
  const [showLoading, setshowLoading] = useState(true);

  return {
    showLoading,
    setshowLoading,
  };
};

export const Loading = (props: { showLoading?: boolean }) => {
  const { showLoading } = props;

  return Platform.OS === "web" ? (
    <>
      <BlurView style={loadingStyle.container}>
        <ActivityIndicator size={50} color="#7b40f2" />
      </BlurView>
    </>
  ) : (
    <BlurView style={loadingStyle.container}>
      <LottieView source={require("./assets/Loading.json")} autoPlay loop />
    </BlurView>
  );
};

const loadingStyle = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});
