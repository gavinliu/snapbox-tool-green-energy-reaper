import { CombinedDarkTheme, CombinedDefaultTheme } from "@/theme/themes";
import { ThemeProvider } from "@react-navigation/native";
import { CustomNavigationBar } from "@snapbox/pkg-ui";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useThemeStore } from "../features/settings/store/useThemeStore";

export default function Layout() {
  const colorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.theme);

  const isDark =
    themeMode === "dark" || (themeMode === "system" && colorScheme === "dark");

  const paperTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;

  SystemUI.setBackgroundColorAsync(paperTheme.colors.background);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={paperTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: true,
            header: (props) => <CustomNavigationBar {...props} />,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "绿色能量收割机",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "设置",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="config"
            options={{
              title: "配置模板",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="statistics"
            options={{
              title: "采集统计",
            }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
