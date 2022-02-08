import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export const Error = ({
  errorMsg,
}: // showError,
{
  errorMsg: string;
  // showError: boolean;
}) => {
  return (
    <>
      <Animatable.View
        style={styles.error}
        animation="fadeIn"
        duration={1000}
        easing="ease"
      >
        <MaterialIcons
          name="error-outline"
          size={24}
          style={{ textAlignVertical: "center" }}
          color="red"
        />
        <Animatable.Text style={styles.errorText}>{errorMsg}</Animatable.Text>
      </Animatable.View>
    </>
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
