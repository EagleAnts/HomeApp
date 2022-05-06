import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, TouchableRipple, useTheme } from "react-native-paper";

export const CustomHeader = ({
  navigation,
  title,
}: {
  navigation: any;
  title: string;
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
        padding: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(105,105,105,0.5)",
      }}
    >
      <TouchableRipple
        onPress={() => navigation.goBack()}
        borderless
        style={{
          borderRadius: 20,
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableRipple>
      <Text
        style={{ fontSize: 20, color: theme.colors.text, marginHorizontal: 10 }}
      >
        {title}
      </Text>
    </View>
  );
};
