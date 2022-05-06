import React from "react";
import {
  ImageBackground,
  ImageRequireSource,
  ImageSourcePropType,
  ImageURISource,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { Card, useTheme } from "react-native-paper";

type CardProps = {
  handlePress: () => void;
  title: string;
  bgImg?: boolean;
  bgImgSource?: ImageSourcePropType;
  cardStyles?: ViewStyle;
};

const BackgroundImage = ({
  children,
  source,
}: {
  children: any;
  source: ImageSourcePropType;
}) => {
  return (
    <ImageBackground
      blurRadius={2}
      resizeMode="cover"
      imageStyle={{ borderRadius: 20, opacity: 0.35 }}
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
      }}
      source={source}
    >
      {children}
    </ImageBackground>
  );
};

export const InfoCard = ({
  handlePress,
  title,
  bgImg = false,
  bgImgSource,
  cardStyles,
}: CardProps) => {
  const theme = useTheme();

  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });
  return (
    <Animated.View style={[animatedStyles, { width: "50%" }]}>
      <Pressable
        onPress={() => {
          handlePress();
          scale.value = withSequence(withSpring(0.8), withSpring(1));
        }}
      >
        <Card
          mode="outlined"
          style={[styles.deviceCard, cardStyles, { justifyContent: "center" }]}
        >
          {bgImg ? (
            <BackgroundImage source={bgImgSource!}>
              <Card.Title
                titleNumberOfLines={4}
                titleStyle={[
                  styles.textStyles,
                  { flexDirection: "row", flexWrap: "wrap" },
                ]}
                title={title}
              />
            </BackgroundImage>
          ) : (
            <Card.Title titleStyle={[styles.textStyles]} title={title} />
          )}
        </Card>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  deviceCard: {
    height: 100,
    borderRadius: 20,
    margin: 5,
    backgroundColor: "black",
  },
  textStyles: {
    fontSize: 16,
    textTransform: "capitalize",
    fontFamily: "SourceSansProRegular",
    color: "white",
    alignSelf: "center",
  },
});
