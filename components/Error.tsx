import React, { useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, ViewStyle, ViewProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  BounceIn,
  BounceInDown,
  BounceOut,
  BounceOutUp,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
// import { FontAwesome } from "@expo/vector-icons";

export const Error = ({
  errorMsg,
  style,
  showError,
}: {
  errorMsg: string;
  style?: ViewStyle;
  showError?: boolean;
}) => {
  const animation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      display: animation.value ? "flex" : "none",
    };
  });

  useEffect(() => {
    if (showError) {
      animation.value = withTiming(1, { duration: 500 });
    } else {
      animation.value = 0;
    }
  }, [showError]);

  return (
    <Animated.View style={[styles.error, animatedStyles]}>
      <MaterialIcons
        name="error-outline"
        size={24}
        style={{ textAlignVertical: "center" }}
        color="red"
      />
      <Text style={styles.errorText}>{errorMsg}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  error: {
    marginBottom: 5,
    flexBasis: "100%",
    flexDirection: "row",
  },
  errorText: {
    padding: 5,
    color: "red",
    fontSize: 12,
  },
});
