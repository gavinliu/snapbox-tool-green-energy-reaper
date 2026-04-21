import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FAB, IconButton, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCounterStore } from "../store/useCounterStore";

export function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { count, increment } = useCounterStore();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <IconButton
        icon="cog"
        iconColor={theme.colors.onSurfaceDisabled}
        onPress={() => router.push("/settings")}
        testID="settings-button"
        style={styles.settingsButton}
      />

      <View style={styles.content}>
        <Text variant="bodyLarge">
          You have pushed the button this many times:
        </Text>
        <Text variant="displayLarge" style={styles.counterText}>
          {count}
        </Text>
      </View>

      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={increment}
        testID="increment-button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    marginTop: 8,
  },
  settingsButton: {
    position: "absolute",
    right: 12,
    zIndex: 1,
    opacity: 0.5,
  },
  fab: {
    position: "absolute",
    right: 16,
  },
});
