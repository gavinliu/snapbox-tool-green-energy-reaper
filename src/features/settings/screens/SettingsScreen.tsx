import React from "react";
import { StyleSheet, View } from "react-native";
import { List, RadioButton, useTheme } from "react-native-paper";
import { ThemeMode, useThemeStore } from "../store/useThemeStore";

export function SettingsScreen() {
  const themeMode = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <RadioButton.Group
          onValueChange={(value) => setTheme(value as ThemeMode)}
          value={themeMode}
        >
          <List.Item
            borderless
            title="System Default"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={(props) => <RadioButton {...props} value="system" />}
            onPress={() => setTheme("system")}
          />
          <List.Item
            borderless
            title="Light Theme"
            left={(props) => (
              <List.Icon {...props} icon="white-balance-sunny" />
            )}
            right={(props) => <RadioButton {...props} value="light" />}
            onPress={() => setTheme("light")}
          />
          <List.Item
            borderless
            title="Dark Theme"
            left={(props) => (
              <List.Icon {...props} icon="moon-waning-crescent" />
            )}
            right={(props) => <RadioButton {...props} value="dark" />}
            onPress={() => setTheme("dark")}
          />
        </RadioButton.Group>
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
