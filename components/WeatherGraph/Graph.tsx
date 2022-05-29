import React, { createContext, useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  interpolatePath,
  mixPath,
  parse,
  serialize,
  useVector,
} from "react-native-redash";

import { buildGraph, GraphData, SIZE } from "./Model";
// import Header from "./Header";
import Cursor from "./Cursor";
import { useTheme } from "react-native-paper";
import moment from "moment";
import Header from "./Header";
import { WeatherDataContext } from "./data";

const { width } = Dimensions.get("window");
const AnimatedPath = Animated.createAnimatedComponent(Path);

const SELECTION_WIDTH = width - 32;
const BUTTON_WIDTH = width - 32;

export const TemperatureContext = createContext({
  tempList: [] as [number, number][],
  setTempList: () => {},
});

const Graph = () => {
  const theme = useTheme();
  const translation = useVector();
  // const transition = useSharedValue(0);
  // const previous = useSharedValue<GraphIndex>(0);
  // const current = useSharedValue<GraphIndex>(0);
  // const animatedProps = useAnimatedProps(() => {
  //   const previousPath = data?.path;
  //   const currentPath = data?.path;
  //   return {
  //     // d: graphs[0].data.path,
  //     // d: interpolatePath(0, [0, 1], [previousPath, currentPath]),
  //     // d: mixPath(transition.value, previousPath, currentPath),
  //   };
  // });
  // const style = useAnimatedStyle(() => ({
  //   transform: [{ translateX: withTiming(BUTTON_WIDTH * current.value) }],
  // }));
  const { seconds: weatherData, setContext } = useContext(WeatherDataContext);
  const [data, setData] = useState<GraphData>();

  // useEffect(() => {
  //   console.log("Weather Data : ", weatherData);
  //   setContext(weatherData);
  // }, [weatherData]);

  useEffect(() => {
    console.log("New Weather Data Length : ", weatherData.length);

    if (weatherData.length !== 0) {
      const new_Data = buildGraph({ temperature: weatherData }, "seconds");
      setData(new_Data);
    }
  }, [weatherData]);

  return (
    <View style={styles.container}>
      {data ? <Header translation={translation} graphData={data} /> : null}
      {data ? (
        <View style={{ margin: 5 }}>
          <Svg width={SIZE} height={SIZE}>
            <AnimatedPath
              // d={graphs[0].data.path}
              // animatedProps={animatedProps}
              d={serialize(data.path)}
              fill={theme.colors.primary}
              stroke={theme.colors.primary}
              strokeWidth={2}
            />
          </Svg>
          <Cursor translation={translation} path={data.path} />
        </View>
      ) : null}
      <View style={styles.selection}>
        {/* <View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.backgroundSelection, style]} />
        </View> */}
        {/* {graphs.map((graph, index) => {
          return (
            <TouchableWithoutFeedback
              key={graph.label}
              onPress={() => {
                previous.value = current.value;
                transition.value = 0;
                current.value = index as GraphIndex;
                transition.value = withTiming(1);
              }}
            >
              <Animated.View style={[styles.labelContainer]}>
                <Text style={styles.label}>{graph.label}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    marginHorizontal: 2,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "transparent",
  },
  backgroundSelection: {
    backgroundColor: "#f3f3f3",
    ...StyleSheet.absoluteFillObject,
    width: BUTTON_WIDTH,
    borderRadius: 8,
  },
  selection: {
    flexDirection: "row",
    width: SELECTION_WIDTH,
    alignSelf: "center",
  },
  labelContainer: {
    padding: 16,
    width: BUTTON_WIDTH,
  },
  label: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Graph;
