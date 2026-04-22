import { showErrorToast, showInfoToast, showSuccessToast } from "@/utils/toast";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CollectionEngine from "../../collector/core/CollectionEngine";
import TemplateMatcher from "../../collector/core/TemplateMatcher";
import { useCollectorStore } from "../../collector/store/useCollectorStore";
import { useConfigStore } from "../../config/store/useConfigStore";
import { FloatingMenuController } from "../../floating-menu/components/FloatingMenuController";

export function CollectionFab() {
  const insets = useSafeAreaInsets();

  const collectButtonTemplate = useConfigStore(
    (state) => state.collectButtonTemplate,
  );
  const findEnergyButtonTemplate = useConfigStore(
    (state) => state.findEnergyButtonTemplate,
  );
  const isConfigComplete = useConfigStore((state) => state.isConfigComplete);
  const isCollecting = useCollectorStore((state) => state.isCollecting);

  const startCollection = useCollectorStore((state) => state.startCollection);
  const stopCollection = useCollectorStore((state) => state.stopCollection);
  const setCurrentOperation = useCollectorStore(
    (state) => state.setCurrentOperation,
  );

  const engineRef = useRef<CollectionEngine | null>(null);
  const menuControllerRef = useRef<FloatingMenuController | null>(null);

  const handleStartCollection = async () => {
    // 检查配置
    if (!collectButtonTemplate || !findEnergyButtonTemplate) {
      showErrorToast("请先完成配置");
      return;
    }

    // 创建采集引擎
    const config = {
      collectButtonTemplate,
      findEnergyTemplate: findEnergyButtonTemplate,
      matchingThreshold: 0.8,
      operationDelay: 3000,
    };
    const matcher = new TemplateMatcher(config);
    const engine = new CollectionEngine(
      config,
      matcher,
      (status) => {
        setCurrentOperation(status);
        menuControllerRef.current?.updateMenuItems(status);
      },
      (report) => {
        stopCollection();
        showSuccessToast(`采集完成！共处理 ${report.totalFriends} 个好友`);
        menuControllerRef.current?.hideMenu();
      },
    );
    engineRef.current = engine;

    try {
      // 先初始化录屏
      showInfoToast("正在启动录屏，请稍候...");
      await engine.initialize();

      menuControllerRef.current = new FloatingMenuController(
        () => engine.start(),
        () => engine.stop(),
      );

      // 显示悬浮菜单
      menuControllerRef.current.showMenu();
      showInfoToast("请打开蚂蚁森林好友列表页");

      startCollection();
    } catch (error) {
      showErrorToast("启动录屏失败，请重试");
      console.error("初始化失败:", error);
    }
  };

  return (
    <FAB
      icon={isCollecting ? "stop" : "leaf"}
      style={{ ...styles.fab, marginBottom: insets.bottom + 16 }}
      mode="flat"
      label={isCollecting ? "停止" : "采集"}
      disabled={!isConfigComplete || isCollecting}
      onPress={handleStartCollection}
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
