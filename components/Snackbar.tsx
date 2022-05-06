import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert as ReactAlert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../hooks/reduxHooks";
import Animated, {
  FadeIn,
  FadeOut,
  FadingTransition,
  Layout,
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const webApp = Platform.select({ web: true, default: false });

export type Alert = {
  msg: string;
  alertType: string;
  id: string;
};

const alertType: any = {
  ["error"]: { color: "#D32F2F", icon: "alert-circle-outline" },
  ["warning"]: { color: "#ED6C02", icon: "warning-outline" },
  ["info"]: { color: "#0288D1", icon: "information-circle-outline" },
  ["success"]: { color: "#2E7D32", icon: "checkmark-done-circle-outline" },
};

const ShowMobileAlert = ({
  message,
  type,
  alertId,
}: {
  message: string;
  type: string;
  alertId: string;
}) => {
  return (
    <Animated.View
      entering={SlideInUp.duration(500)}
      exiting={SlideOutUp.duration(500)}
      style={[
        styles.mobileContainer,
        { backgroundColor: alertType[type].color },
      ]}
    >
      <Ionicons
        name={alertType[type].icon}
        size={24}
        style={{ marginHorizontal: 5 }}
        color="white"
      />
      <Text
        style={[
          styles.alertText,
          {
            textAlign: "center",
            padding: 5,
            flex: 1,
            flexWrap: "wrap",
            flexDirection: "row",
          },
        ]}
      >
        <Text>{message}</Text>
      </Text>
    </Animated.View>
  );
};
const ShowAlert = ({
  message,
  type,
  alertId,
}: {
  message: string;
  type: string;
  alertId: string;
}) => {
  return (
    <View
      style={[
        styles.webViewStyles,
        {
          backgroundColor: alertType[type].color,
        },
      ]}
    >
      <Ionicons name={alertType[type].icon} size={24} color="white" />
      <Text style={styles.alertText}>{message}</Text>
    </View>
  );
};

export const SnackBar = () => {
  const alerts = useAppSelector((state) => state.alert);

  const alertsList = alerts
    .slice(0)
    .reverse()
    .map((alert: Alert) =>
      webApp ? (
        <ShowAlert
          key={alert.id}
          alertId={alert.id}
          message={alert.msg}
          type={alert.alertType}
        />
      ) : (
        <ShowMobileAlert
          key={alert.id}
          alertId={alert.id}
          message={alert.msg}
          type={alert.alertType}
        />
      )
    );

  if (webApp) {
    return (
      <View style={styles.webContainer}>
        <ScrollView
          style={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {alertsList}
        </ScrollView>
      </View>
    );
  }

  return <>{alertsList}</>;
};

const styles = StyleSheet.create({
  webContainer: {
    position: "absolute",
    width: "max-content",
    maxHeight: 150,
    alignItems: "flex-start",
    top: 0,
    right: 0,
    padding: 10,
    borderRadius: 5,
  },
  webViewStyles: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    width: "max-content",
    justifyContent: "center",
    padding: 5,
    margin: 2,
    borderRadius: 5,
  },
  mobileContainer: {
    position: "absolute",
    padding: 5,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  alertText: {
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    color: "white",
  },
});
