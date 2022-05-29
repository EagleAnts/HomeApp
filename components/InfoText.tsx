import React from "react";
import { StyleSheet, View } from "react-native";
import { Subheading, useTheme } from "react-native-paper";

export const InfoText = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number | React.ReactNode;
  children?: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.InfoStyles]}>
      <Subheading style={[styles.TextStyles, { color: theme.colors.text }]}>
        {label}
      </Subheading>
      {children}
      {value ? (
        <Subheading style={[styles.TextStyles, { color: theme.colors.text }]}>
          {value}
        </Subheading>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  InfoStyles: {
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  TextStyles: {},
});
