import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Title, useTheme } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { ReText, Vector, round } from "react-native-redash";
import { Path } from "react-native-svg";

import { GraphData, SIZE } from "./Model";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  values: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  value: {
    fontWeight: "500",
    fontSize: 24,
  },
  label: {
    fontSize: 18,
  },
});

interface HeaderProps {
  translation: Vector<Animated.SharedValue<number>>;
  graphData: GraphData;
}

const Header = ({ translation, graphData }: HeaderProps) => {
  const data = useDerivedValue(() => graphData);
  //   console.log("Header Data : ", data);
  const temp = useDerivedValue(() => {
    const p = interpolate(
      translation.y.value,
      [0, SIZE],
      [data.value.maxTemp, data.value.minTemp]
    );
    return `${round(p)} ℃`;
  });

  const WeatherIcon = () => {
    const latestTemp = graphData.latestTemperature;

    if (latestTemp >= 35)
      return (
        <Image
          source={require("../../assets/weather-assests/icons8-sun-64.png")}
        />
      );
    else if (latestTemp >= 25 && latestTemp < 35)
      return (
        <Image
          source={require("../../assets/weather-assests/icons8-partly-cloudy-day-64.png")}
        />
      );

    return null;
  };

  const theme = useTheme();
  const label = useDerivedValue(() => data.value.label);

  return (
    <View style={styles.container}>
      <View style={styles.values}>
        <View>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Weather
          </Text>
          <ReText
            style={[styles.value, { color: theme.colors.text }]}
            text={temp}
          />
        </View>

        <View>
          <WeatherIcon />
        </View>
      </View>
    </View>
  );
};

export default Header;
