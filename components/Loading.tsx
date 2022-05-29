import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  Dimensions,
  View,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "react-native-paper";

const webApp = Platform.select({ web: true, default: false });

const { height, width } = Dimensions.get("screen");

export const useLoading = () => {
  const [showLoading, setshowLoading] = useState(false);

  return {
    showLoading,
    setshowLoading,
  };
};

export const SplashScreen = () => {
  const theme = useTheme();
  console.log("Splash Screen...");
  return (
    <View style={[loadingStyle.container]}>
      <ActivityIndicator size={50} color={theme.colors.primary} />
    </View>
  );
};

export const HomeSplashScreen = () => {
  console.log("Home Splash Screen....");
  const theme = useTheme();
  return (
    <View
      style={[
        loadingStyle.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {webApp ? (
        <SplashScreen />
      ) : (
        <LottieView
          source={require("../assets/HomeLoading.json")}
          colorFilters={[
            {
              keypath: "Home Outlines",
              color: "#53D8FB",
            },
          ]}
          style={{ height: 100, width: 100 }}
          autoPlay
          loop
          speed={1}
        />
      )}
    </View>
  );
};

export const SimpleLoading = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator
        size={30}
        style={{ height: "100%", width: "100%" }}
        color={theme.colors.primary}
      />
    </View>
  );
};

export const LottieLoading = () => {
  return (
    <View
      style={[loadingStyle.container, { backgroundColor: "rgba(0,0,0,0.8)" }]}
    >
      <LottieView
        source={require("../assets/Loading.json")}
        autoPlay
        loop
        speed={1.5}
      />
    </View>
  );
};

export const NetworkError = () => {
  return (
    <View style={[loadingStyle.container]}>
      <Image
        source={require("../assets/server.png")}
        style={{ height: 300, width: 300 }}
      />
      <Text>Oops! Error While Connecting to Server :(</Text>
    </View>
  );
};

const loadingStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    height,
    width,
  },
});
