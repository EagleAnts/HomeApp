import React, { createContext, useContext, useEffect } from "react";
import {
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
} from "react-native";
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

// Font Awesome Icons
import { MaterialIcons } from "@expo/vector-icons";

// Socket Handler
import { ApiSocket, RaspiSocket } from "../utils/clientSocketProvider";

import {
  ClientSocketProvider,
  ClientSocketContext,
} from "../utils/clientSocketProvider";

// Other Screens
import DashboardScreen from "./Dashboard";
import DevicesScreen from "./Devices";
import ProfileScreen from "./Profile";
import SettingsScreen from "./Settings";
import { AuthError, RevokeTokenRequest } from "expo-auth-session";
import { Appbar, Portal, useTheme } from "react-native-paper";
import { CustomTabBar } from "../components/CustomTabBar";
import { DeviceForm } from "./DeviceForm";
import { RootState } from "../store";
import { io, Socket } from "socket.io-client";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { AddPiScreen } from "./AddRaspPi";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import CryptoES from "crypto-es";

// Initialize Socket Connection to /raspberrypi
import Constants from "expo-constants";
import {
  HomeSplashScreen,
  LottieLoading,
  SplashScreen,
} from "../components/Loading";
import { device_Type, loadDeviceTypes } from "../redux/actions/devices";
import {
  connectPi,
  getRaspberryPisAndDevices,
} from "../redux/actions/dashboard";
import { setAlert } from "../redux/actions/alert";

export type RootHomeTabParamList = {
  Dashboard: { userName: string; email: string };
  Devices: undefined;
  PiDetails: undefined;
  Profile: { userName: string; email: string };
  Settings: { email: string };
};

export type HomeStackParamList = {
  RootHome: undefined;
  Splash: undefined;
  Modal: {
    id: string;
    headerTitle: string;
    email: string;
    username: string;
    userID: string;
  };
};
export type RootHomeProps = NativeStackScreenProps<HomeStackParamList>;

export type BottomTabBarProps = BottomTabScreenProps<RootHomeTabParamList>;

export type DashboardScreenProps = BottomTabScreenProps<
  RootHomeTabParamList,
  "Dashboard"
>;
export type ProfileScreenProps = BottomTabScreenProps<
  RootHomeTabParamList,
  "Profile"
>;

export type ModalScreenProps = BottomTabScreenProps<
  HomeStackParamList,
  "Modal"
>;

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootHomeTabParamList>();

const RootHomeTab = ({ navigation, route }: RootHomeProps) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userDetails = useAppSelector((state) => {
    return { token: state.auth.token, id: state.auth.user!.id };
  });
  const dispatch = useAppDispatch();

  const raspiList = useAppSelector((state) => state.Dashboard.raspiList);
  useEffect(() => {
    if (!raspiList) {
      console.log("Fetching User's RaspberryPis and their Devices ....");
      dispatch(getRaspberryPisAndDevices(ApiSocket));
    }

    return () => {
      console.log("Dashboard Cleanup");
    };
  }, []);

  useEffect(() => {
    console.log("Current Raspi List : ", raspiList);
    if (raspiList) {
      raspiList.forEach((el) => {
        console.log("Join Room Event ...");
        RaspiSocket?.emit(
          "raspberrypi:join_room",
          { roomID: el.piID, piName: el.piName },
          (cbRes: any) => {
            console.log(cbRes);

            if (cbRes.status === 200) {
              dispatch(
                connectPi({
                  piID: el.piID,
                  piName: el.piName,
                  totalDevices: el.deviceList.length,
                })
              );
              dispatch(setAlert(cbRes.msg, "success"));
            } else dispatch(setAlert(cbRes.msg, "error"));
          }
        );
      });
    }
  }, [raspiList]);

  useEffect(() => {
    ApiSocket?.emit("api:getDeviceTypes", null, (data: device_Type) => {
      dispatch(loadDeviceTypes(data));
    });
  }, []);

  const theme = useTheme();
  return (
    <Portal.Host>
      <Tab.Navigator
        tabBar={(props) => {
          const tabBarStyle: any =
            props.descriptors[props.state.routes[props.state.index].key].options
              .tabBarStyle;
          // console.log(tabBarStyle);
          let showTabBar = true;
          if (tabBarStyle) {
            showTabBar = tabBarStyle.display !== "none";
          }
          return showTabBar ? <CustomTabBar {...props} /> : null;
        }}
        sceneContainerStyle={{
          backgroundColor: theme.colors.background,
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, focused }) => {
            let iconName: keyof typeof MaterialIcons.glyphMap | "" = "";
            if (route.name === "Devices") {
              iconName = "devices";
            } else if (route.name === "Profile") {
              iconName = "account-circle";
            } else if (route.name === "Dashboard") {
              iconName = "dashboard";
            } else if (route.name === "Settings") {
              iconName = "settings";
            } else if (route.name === "PiDetails") {
              iconName = "add";
            }
            return iconName ? (
              <MaterialIcons
                name={iconName}
                size={24}
                selectable={false}
                color={color}
              />
            ) : null;
          },
          headerShown: false,
          unmountOnBlur: true,
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Devices" component={DevicesScreen} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          // initialParams={{ userName: user?.name, email: user?.email }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          initialParams={{ email: user?.email }}
        />
      </Tab.Navigator>
    </Portal.Host>
  );
};

export const HomeScreen = () => {
  const theme = useTheme();
  const user = useAppSelector((state: RootState) => state.auth.user);

  const { connected } = useContext(ClientSocketContext);

  return (
    <Portal.Host>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {!connected ? (
          <Stack.Screen
            name="Splash"
            component={HomeSplashScreen}
            options={{
              headerShown: false,
              animationTypeForReplace: "pop",
            }}
          />
        ) : (
          <Stack.Group>
            <Stack.Screen name="RootHome" component={RootHomeTab} />
            <Stack.Screen
              name="Modal"
              component={AddPiScreen}
              options={({ navigation, route }) => ({
                presentation: "fullScreenModal",
                headerShown: true,
                animation: "fade",
                headerTransparent: true,
                headerTintColor: "white",
                headerTitle: route.params.headerTitle,
                animationTypeForReplace: "pop",
              })}
              initialParams={{ userID: user?.id }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </Portal.Host>
  );
};

export const AppHome = () => {
  return (
    <ClientSocketProvider>
      <HomeScreen />
    </ClientSocketProvider>
  );
};

/* <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            if (route.name === "Devices") {
              iconName = "devices";
            } else if (route.name === "Profile") {
              iconName = "account-circle";
            } else if (route.name === "Dashboard") {
              iconName = "dashboard";
            } else if (route.name === "Settings") {
              iconName = "settings";
            }
            return <MaterialIcons name={iconName} size={24} color={color} />;
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Devices" component={DevicesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator> */

/***
 * Custom Tab Styles
 */
// webtabBarStyles: {
//   marginLeft: 2,
//   borderRadius: 10,
//   alignSelf: "center",
//   flexDirection: "column",
//   height: "80%",
// },
// mobiletabBarStyles: {
//   paddingTop: 0,
//   // paddingHorizontal: 10,
//   flexDirection: "row",
//   height: 50,
// },
