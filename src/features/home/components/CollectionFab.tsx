import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useConfigStore } from '../../config/store/useConfigStore';
import { useCollectorStore } from '../../collector/store/useCollectorStore';
import { showErrorToast, showInfoToast } from '@/utils/toast';
import TemplateMatcher from '../../collector/core/TemplateMatcher';
import CollectionEngine from '../../collector/core/CollectionEngine';
import { FloatingMenuController } from '../../floating-menu/components/FloatingMenuController';

export function CollectionFab() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const collectButtonTemplate = useConfigStore((state) => state.collectButtonTemplate);
  const findEnergyButtonTemplate = useConfigStore((state) => state.findEnergyButtonTemplate);
  const isConfigComplete = useConfigStore((state) => state.isConfigComplete);

  const isCollecting = useCollectorStore((state) => state.isCollecting);
  const startCollection = useCollectorStore((state) => state.startCollection);
  const stopCollection = useCollectorStore((state) => state.stopCollection);
  const setCurrentOperation = useCollectorStore((state) => state.setCurrentOperation);

  const menuControllerRef = useRef<FloatingMenuController | null>(null);

  const handleStartCollection = async () => {
    // 检查配置
    if (!collectButtonTemplate || !findEnergyButtonTemplate) {
      showErrorToast('请先完成配置');
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
        navigation.navigate('statistics' as never, { report });
        menuControllerRef.current?.hideMenu();
      }
    );

    menuControllerRef.current = new FloatingMenuController(
      () => engine.start(),
      () => engine.stop()
    );

    // 显示悬浮菜单
    menuControllerRef.current.showMenu();
    showInfoToast('请打开蚂蚁森林好友列表页');

    startCollection();
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
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
