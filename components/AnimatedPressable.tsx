import { StyleSheet, Pressable, View, Text, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Pressable = {
  onPress: Function;
  viewStyles?: ViewStyle;
  title: string;
  icon?: React.ReactNode;
};

export default ({ onPress = () => {}, viewStyles, title, icon }: Pressable) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const rStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[rStyles, viewStyles]}>
      <Pressable
        style={[styles.dropdown, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          onPress();
          scale.value = withSequence(withSpring(0.8), withSpring(1));
        }}
      >
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.textStyles]}>{title}</Text>
          {icon}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    padding: 10,
    borderRadius: 50,
  },
  textStyles: {
    fontWeight: "bold",
    fontFamily: "SourceSansProRegular",
    color: "white",
    textTransform: "capitalize",
  },
});
