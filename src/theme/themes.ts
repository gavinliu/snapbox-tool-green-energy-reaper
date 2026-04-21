import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import Colors from "./colors";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const CombinedDefaultTheme = {
  ...LightTheme,
  ...MD3LightTheme,

  colors: {
    ...LightTheme.colors,
    ...Colors.light,
  },
  fonts: {
    ...LightTheme.fonts,
    ...MD3LightTheme.fonts,
  },
};

export const CombinedDarkTheme = {
  ...DarkTheme,
  ...MD3DarkTheme,

  colors: {
    ...DarkTheme.colors,
    ...Colors.dark,
  },
  fonts: {
    ...DarkTheme.fonts,
    ...MD3DarkTheme.fonts,
  },
};
