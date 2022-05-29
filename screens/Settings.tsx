import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  Switch,
  useTheme,
  Appbar,
  IconButton,
  Colors,
  Portal,
  Modal,
  Headline,
  Divider,
  Title,
  Button,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/auth";
import { DarkTheme, DefaultTheme, ThemeContext } from "../utils/customTheme";
import { ListItem } from "../components/ListItem";
import Animated, {
  BounceIn,
  Easing,
  FadeIn,
  FadeOut,
  interpolateColor,
  Layout,
  SequencedTransition,
  SlideInLeft,
  SlideInUp,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { BottomTabBarProps } from "./Home";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomHeader } from "../components/CustomHeader";
import { CustomModal } from "../components/CustomModal";
import { useAppSelector } from "../hooks/reduxHooks";
import { InfoText } from "../components/InfoText";
import { FlatList } from "react-native-gesture-handler";
import { DeviceListType, RaspiList } from "../redux/reducers/dashboardReducer";
import { device_Type } from "../redux/actions/devices";
import { ApiSocket } from "../utils/clientSocketProvider";
import { useRoute } from "@react-navigation/native";

const FlatListItem = ({ item, email }: { item: RaspiList; email: string }) => {
  const [showText, setShowText] = useState(false);
  const [text, setText] = useState("");

  const theme = useTheme();

  console.log("Item : ", item);

  const generateKey = () => {
    ApiSocket?.emit(
      "api:genApiKey",
      {
        piID: item.piID,
      },
      (cbRes: string) => {
        setText(cbRes);
      }
    );
  };

  const getApiKey = () => {
    ApiSocket?.emit("api:getApiKey", { piID: item.piID }, (cbRes: string) => {
      setText(cbRes);
    });
  };

  return !item.apiKey ? null : (
    <View
      style={{
        margin: 2,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      <Title
        style={{
          textTransform: "capitalize",
          fontFamily: "SourceSansProRegular",
        }}
      >
        {item.piName}
      </Title>
      <IconButton
        icon={showText ? "eye-off" : "eye"}
        onPress={() => {
          getApiKey();
          setShowText(!showText);
        }}
      />
      {showText ? (
        <Animated.View
          entering={FadeIn.duration(500).easing(Easing.cubic)}
          style={[
            {
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          // layout={Layout}
        >
          <Text selectable style={{ color: theme.colors.text }}>
            {text ? text : "No API Key Exists"}
          </Text>
          <Button onPress={generateKey}>Generate A Key</Button>
        </Animated.View>
      ) : null}
    </View>
  );
};

const Settings = ({ navigation, route }: BottomTabBarProps) => {
  const dispatch = useDispatch();

  const { height } = useWindowDimensions();

  const { toggleTheme, isDarkTheme } = useContext(ThemeContext);

  const theme = useTheme();

  const raspiList = useAppSelector((state) => state.Dashboard.raspiList);

  const [visible, setVisible] = useState(false);

  const handleModalDismiss = () => {
    setVisible(false);
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader navigation={navigation} title="Settings" />
      <ListItem
        id="1"
        textStyles={[styles.textStyles, { color: theme.colors.text }]}
        title="Logout from Device"
        onPress={() => logoutUser()}
        children={
          <Ionicons name="exit" color={theme.colors.accent} size={24} />
        }
      />
      <ListItem
        id="2"
        textStyles={[styles.textStyles, { color: theme.colors.text }]}
        title="Dark Mode"
        touchable={false}
        children={<Switch value={isDarkTheme} onValueChange={toggleTheme} />}
      />
      <ListItem
        id="3"
        textStyles={[styles.textStyles, { color: theme.colors.text }]}
        title="Show API Keys"
        onPress={() => {
          setVisible(true);
        }}
        children={
          <Ionicons name="key" color={theme.colors.primary} size={24} />
        }
      />
      <CustomModal handleModalDismiss={handleModalDismiss} visible={visible}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <FlatList
            ItemSeparatorComponent={() => <Divider />}
            style={{ width: "100%", height: "100%", margin: 10 }}
            data={raspiList}
            renderItem={({ item }) => (
              <FlatListItem item={item} email={route.params?.email!} />
            )}
            keyExtractor={(item) => item.piID}
          />
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textStyles: {
    fontSize: 15,
  },
});

export default Settings;
