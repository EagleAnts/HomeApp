import React, { useEffect, createContext } from "react";
import { Image, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoginAndSignUp from "./screens/LoginAndSignUp";
import { AppHome } from "./screens/Home";

// Components
import {
  Loader,
  LottieLoading,
  NetworkError,
  SplashScreen,
  useLoading,
} from "./components/Loading";

import GlobalStyles from "./GlobalStyles";

// SecureStore
import * as SecureStore from "expo-secure-store";

// User Authentication
import * as LocalAuthentication from "expo-local-authentication";

// Redux Store
import { Platform, Pressable } from "react-native";

import { LOGOUT } from "./redux/actions/actionTypes";
import { loadUser, logout } from "./redux/actions/auth";
import { LOGIN_SUCCESS, RESTORE_TOKEN } from "./redux/actions/actionTypes";
import { useTheme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";

const Stack = createNativeStackNavigator();

const webApp = Platform.select({ web: true, default: false });

export const MainApp = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const theme = useTheme();

  const getBiometricInfo = async () => {
    const hasSupport = await LocalAuthentication.hasHardwareAsync();
    return hasSupport;
  };
  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Please Place Your Finger",
    });
    return biometricAuth;
  };

  useEffect(() => {
    // const bootstrapAsync = async () => {
    //   let usertoken;
    //   try {
    //     usertoken = webApp
    //       ? sessionStorage.getItem("userToken")
    //       : await SecureStore.getItemAsync("userToken");
    //     // console.log(usertoken);
    //   } catch (e) {
    //     console.error(e);
    //   }

    //   dispatch({
    //     type: RESTORE_TOKEN,
    //     payload: { token: usertoken },
    //   });
    //   if (usertoken) dispatch(loadUser());
    // };
    // bootstrapAsync();
    // handleBiometricAuth();
    // .then(() => {
    // });

    // Checking for Biometrics
    // if (authState.token) {
    //   getBiometricInfo().then((res) => {
    //     if (res)
    //       handleBiometricAuth().then((res) => {
    //         console.log(res);
    //         if (!res.success) dispatch(logout());
    //       });
    //   });
    // }

    return () => console.log("MainApp Cleanup");
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {authState.isLoading ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              headerShown: false,
              animationTypeForReplace: "pop",
            }}
          />
        ) : !authState.isLoading && authState.isServerError ? (
          <Stack.Screen
            name="NetworkError"
            component={NetworkError}
            options={{ headerShown: false, animationTypeForReplace: "pop" }}
          />
        ) : authState.isAuthenticated ? (
          <Stack.Screen
            name="Home"
            component={AppHome}
            options={{
              animation: "fade_from_bottom",
              headerShown: false,
              // headerTintColor: "hsl(248,50%,50%)",
              // headerTitle: ({ tintColor }) => (
              //   <Pressable>
              //     <Image
              //       style={{ height: 30, width: 30 }}
              //       source={require("./assets/favicon.png")}
              //     />
              //   </Pressable>
              // ),
            }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            options={{
              headerShown: false,
              animationTypeForReplace: authState.isSignout ? "pop" : "push",
            }}
            component={LoginAndSignUp}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
