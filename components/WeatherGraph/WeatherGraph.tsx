import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import moment from "moment";
import Graph from "./Graph";

export const WeatherGraph = () => {
  const theme = useTheme();

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Graph />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 10,
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
