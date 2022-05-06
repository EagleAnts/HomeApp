import { api } from "./apiHelpers/api";
import { store } from "../store";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const webApp = Platform.select({ web: true, default: false });

export const setAuthToken = async (token: string) => {
  console.log("Set Authentication Token", token);
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    if (webApp) {
      sessionStorage.setItem("userToken", token);
    } else {
      await SecureStore.setItemAsync("userToken", token);
    }
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    if (webApp) {
      sessionStorage.removeItem("userToken");
      sessionStorage.removeItem("aesPassword");
    } else {
      SecureStore.deleteItemAsync("userToken");
      SecureStore.deleteItemAsync("aesPassword");
    }
  }
};
