import React, { useCallback, useEffect, useState } from "react";
import { Platform, SafeAreaView } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";
import { MainApp } from "./MainApp";

import GlobalStyles from "./GlobalStyles";
import { SnackBar } from "./components/Snackbar";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Provider as PaperProvider } from "react-native-paper";
import { DefaultTheme, DarkTheme, ThemeContext } from "./utils/customTheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { loadUser } from "./redux/actions/auth";
import { RESTORE_TOKEN } from "./redux/actions/actionTypes";
import * as SecureStore from "expo-secure-store";
const webApp = Platform.select({ web: true, default: false });

const App = () => {
  const [loaded] = useFonts({
    SourceSansProRegular: require("./assets/fonts/SourceSansPro-Regular.ttf"),
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      // await SecureStore.deleteItemAsync("userToken");
      // await SecureStore.deleteItemAsync("aesPassword");
      let usertoken;
      try {
        usertoken = webApp
          ? sessionStorage.getItem("userToken")
          : await SecureStore.getItemAsync("userToken");
        // console.log(usertoken);
      } catch (e) {
        console.error(e);
      }

      store.dispatch({
        type: RESTORE_TOKEN,
        payload: { token: usertoken },
      });
      if (usertoken) store.dispatch(loadUser());

      // Checking for Biometrics

      // if (usertoken)
      //   getBiometricInfo().then((res) => {
      //     if (res)
      //       handleBiometricAuth().then((res) => {
      //         console.log(res);
      //         if (!res.success) dispatch(logout());
      //       });
      //   });
    };
    bootstrapAsync();
    // handleBiometricAuth();
    // .then(() => {

    // });

    return () => console.log("App Cleanup");
  }, []);

  const [isDarkTheme, setisDarkTheme] = useState(false);
  let theme = isDarkTheme ? DarkTheme : DefaultTheme;

  const toggleTheme = useCallback(() => {
    return setisDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);

  const preferences = React.useMemo(
    () => ({ toggleTheme, isDarkTheme }),
    [toggleTheme, isDarkTheme]
  );

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <StatusBar style="light" hidden />
        <ThemeContext.Provider value={preferences}>
          <PaperProvider theme={theme}>
            <GestureHandlerRootView
              style={{ flex: 1, backgroundColor: theme.colors.background }}
            >
              <MainApp />
            </GestureHandlerRootView>
          </PaperProvider>
        </ThemeContext.Provider>
        <SnackBar />
      </SafeAreaView>
    </Provider>
  );
  // showLoading ? <Loading /> :
};

export default App;
