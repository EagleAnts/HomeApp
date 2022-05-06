import React, { useContext } from "react";
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";
import { Divider, TouchableRipple, useTheme } from "react-native-paper";
import { ThemeContext } from "../utils/customTheme";

type item = {
  id: string;
  title: string;
  touchable?: boolean;
  children?: React.ReactChild;
  onPress?: Function;
  contentStyles?: StyleProp<ViewStyle>;
  itemStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  iconStyles?: StyleProp<TextStyle>;
};

export const ListItem = ({
  id,
  title,
  onPress = () => {},
  touchable = true,
  textStyles = defaultStyles.textStyles,
  itemStyles = defaultStyles.itemStyles,
  contentStyles = defaultStyles.contentStyles,
  iconStyles = defaultStyles.iconStyles,
  children,
}: item) => {
  const theme = useTheme();
  const { isDarkTheme } = useContext(ThemeContext);
  return (
    <View style={[itemStyles]}>
      {touchable ? (
        <TouchableRipple
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => onPress(id, title)}
        >
          <View style={[contentStyles, { margin: 0 }]}>
            <Text selectable={false} style={[textStyles]}>
              {title}
            </Text>
            {children}
          </View>
        </TouchableRipple>
      ) : (
        <View style={[contentStyles]}>
          <Text selectable={false} style={[textStyles]}>
            {title}
          </Text>
          {children}
        </View>
      )}
      {/* <View style={[defaultStyles.dividerStyles]} /> */}
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  itemStyles: {
    marginBottom: 5,
    width: "100%",
    height: 60,
    alignItems: "center",
  },
  contentStyles: {
    paddingHorizontal: 10,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  textStyles: {
    includeFontPadding: true,
    fontFamily: "SourceSansProRegular",
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  iconStyles: {},
  dividerStyles: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(105,105,105,0.5)",
    width: "100%",
  },
});
