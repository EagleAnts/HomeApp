import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const CustomOption = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.options, { backgroundColor: theme.colors.primary }]}
      activeOpacity={0.7}
    >
      <Text
        style={{
          color: "white",
          fontSize: 15,
          fontWeight: "bold",
          fontFamily: "SourceSansProRegular",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  options: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 50,
  },
});
