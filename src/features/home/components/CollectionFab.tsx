import { collectionEngine } from "@/features/collector/core/CollectionEngine";
import { useCollectorStore } from "@/features/collector/store/useCollectorStore";
import { useConfigStore } from "@/features/config/store/useConfigStore";
import { showErrorToast } from "@/utils/toast";
import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CollectionFab() {
  const insets = useSafeAreaInsets();
  const isRecording = useCollectorStore(
    (state) => state.recordStatus === "recording",
  );

  const handlePress = async () => {
    try {
      const collectButtonTemplate =
        useConfigStore.getState().collectButtonTemplate;
      const findEnergyButtonTemplate =
        useConfigStore.getState().findEnergyButtonTemplate;

      if (!collectButtonTemplate || !findEnergyButtonTemplate) {
        throw new Error("请先完成配置");
      }

      await collectionEngine.toggleEngine();
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "操作失败");
    }
  };

  return (
    <FAB
      icon={isRecording ? "stop" : "leaf"}
      style={{ ...styles.fab, marginBottom: insets.bottom + 16 }}
      mode="flat"
      label={isRecording ? "停止" : "采集"}
      onPress={handlePress}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
