import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const specialCharacters = "!@#$%^&*(){}[]";

function generateString(length: number) {
  let result = "";
  const charactersLength = characters.length;
  const specialCharactersLength = specialCharacters.length;
  for (let i = 0; i < length; i++) {
    result +=
      Math.random() < 0.75
        ? characters.charAt(Math.floor(Math.random() * charactersLength))
        : specialCharacters.charAt(
            Math.floor(Math.random() * specialCharactersLength)
          );
  }

  return result;
}

export async function getAesPassword() {
  if (webApp) return sessionStorage.getItem("aesPassword");
  return await SecureStore.getItemAsync("aesPassword");
}

const webApp = Platform.select({ web: true, default: false });

export async function aesKeyGeneration() {
  const password = generateString(32);

  if (webApp) {
    sessionStorage.setItem("aesPassword", password);
  } else {
    await SecureStore.setItemAsync("aesPassword", password);
  }
  return password;
}
