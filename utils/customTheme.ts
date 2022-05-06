import { createContext } from "react";
import { Theme } from "react-native-paper/lib/typescript/types";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";

export interface CustomThemeProps extends Theme {
  customDefaultColors?: {};
  customDarkColors?: {};
}

export const ThemeContext = createContext({
  toggleTheme: () => {},
  isDarkTheme: false,
});

export const DefaultTheme: CustomThemeProps = {
  ...PaperDefaultTheme,
  roundness: 4,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: "#53D8FB",
    accent: "#6BF178",
    background: "#FFFBFB", //Snow
    surface: "#fffbfb",
    text: "#000000",
    error: "#53d8fbff",
    disabled: "#53d8fbff",
    placeholder: "#53d8fbff",
    backdrop: "rgba(0,0,0,0.5)",
    onSurface: "#53d8fbff",
    notification: "tomato",
  },
  fonts: {
    ...PaperDefaultTheme.fonts,
    // thin: {
    //   fontFamily: "SourceSansProLight",
    //   fontWeight: "100",
    // },
    // light: {
    //   fontFamily: "SourceSansProLight",
    //   fontWeight: "100",
    // },
    // regular: {
    //   fontFamily: "SourceSansProLight",
    //   fontWeight: "normal",
    // },
    // medium: {
    //   fontFamily: "SourceSansProLight",
    //   fontWeight: "100",
    // },
  },
  animation: {
    scale: 1,
  },
};

export const DarkTheme: CustomThemeProps = {
  ...PaperDarkTheme,
  roundness: 4,
  colors: {
    ...PaperDarkTheme.colors,
    primary: "#4C0070",
    accent: "#7A0BC0",
    background: "#121212", // Smoky Black
    surface: "#121212",
    text: "#ffffff",
    error: "#53d8fbff",
    disabled: "#53d8fbff",
    placeholder: "#53d8fbff",
    backdrop: "rgba(0,0,0,0.5)",
    onSurface: "#53d8fbff",
    notification: "tomato",
  },
  fonts: {
    ...PaperDefaultTheme.fonts,
    // thin: {
    //   fontFamily: "SourceSansProLight",
    //   fontWeight: "100",
    // },
    // light: {
    //   fontFamily: "SourceSansProLight",
    //   fontWeight: "100",
    // },
    // regular: {
    //   fontFamily: "SourceSansProLight",
    //   fontWeight: "normal",
    // },
    // medium: {
    //   fontFamily: "SourceSansProLight",
    //   fontWeight: "100",
    // },
  },
  animation: {
    scale: 1,
  },
};
