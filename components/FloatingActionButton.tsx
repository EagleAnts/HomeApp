import React from "react";
import { StyleSheet, View, Text, ViewProps, ViewStyle } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type fabType = {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  viewStyle: ViewStyle;
};

const FloatingActionButton = ({ name, title, viewStyle }: fabType) => {
  const theme = useTheme();
  return (
    <TouchableRipple
      borderless
      style={[viewStyle, { backgroundColor: theme.colors.primary }]}
      onPress={() => {}}
    >
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <MaterialCommunityIcons
          selectable={false}
          name={name}
          style={{ marginHorizontal: 5 }}
          size={20}
          color="white"
        />
        <Text style={[styles.textStyles, { color: "white" }]}>{title}</Text>
      </View>
    </TouchableRipple>
  );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
  textStyles: {},
});
