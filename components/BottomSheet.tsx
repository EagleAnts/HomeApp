import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  ScrollView as ScrollingView,
} from "react-native-gesture-handler";
import { Portal, useTheme } from "react-native-paper";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
  useDerivedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAppDispatch } from "../hooks/reduxHooks";
import { selectRaspi } from "../redux/actions/dashboard";
import { InfoCard } from "./Card";
import { TABBAR_HEIGHT } from "./CustomTabBar";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type BottomSheetProps = {
  children?: React.ReactNode;
  MAX_TRANSLATE_Y: number;
};
export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

export const BottomSheet = React.forwardRef<
  BottomSheetRefProps,
  BottomSheetProps
>(({ children, MAX_TRANSLATE_Y }, ref) => {
  const theme = useTheme();

  const translateY = useSharedValue(0);
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    active.value = destination !== 0;
    translateY.value = withTiming(destination, {
      duration: 1000,
    });
  }, []);

  const isActive = useCallback(() => {
    "worklet";
    return active.value;
  }, []);

  useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
    scrollTo,
    isActive,
  ]);

  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1.2) {
        scrollTo(0);
      } else if (translateY.value < -SCREEN_HEIGHT / 2) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rStyles = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );
    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Portal>
      <GestureDetector gesture={gesture}>
        <Animated.View
          entering={SlideInDown.easing(Easing.linear)}
          exiting={SlideOutDown.easing(Easing.linear)}
          style={[
            styles.bottomSheetContainer,
            rStyles,
            {
              backgroundColor: theme.colors.background,
              paddingBottom: TABBAR_HEIGHT + 20,
            },
          ]}
        >
          <View style={[styles.line]} />
          {children}
        </Animated.View>
      </GestureDetector>
    </Portal>
  );
});

export const PisBottomSheet = React.forwardRef<
  BottomSheetRefProps,
  BottomSheetProps
>(({ children, MAX_TRANSLATE_Y }, ref) => {
  return (
    <BottomSheet
      MAX_TRANSLATE_Y={MAX_TRANSLATE_Y}
      ref={ref}
      children={
        <ScrollingView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {
              alignSelf: "flex-start",
              flexDirection: "row",
              flexWrap: "wrap",
            },
          ]}
        >
          {children}
        </ScrollingView>
      }
    />
  );
});

const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: "absolute",
    top: SCREEN_HEIGHT,
    height: SCREEN_HEIGHT,
    width: "100%",
    borderRadius: 25,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(105, 105, 105, 0.5)",
    overflow: "hidden",
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 5,
  },
});
