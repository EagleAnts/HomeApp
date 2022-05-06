import Constants from "expo-constants";
import axios from "axios";

console.log(Constants.manifest?.extra?.apiAddress);

export const api = axios.create({
  baseURL: Constants.manifest?.extra?.apiAddress,
  headers: {
    "Content-Type": "application/json",
  },
});
