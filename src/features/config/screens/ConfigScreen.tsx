import { saveFile } from "@/utils/fileSystem";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { TemplatePicker } from "../components/TemplatePicker";
import { useConfigStore } from "../store/useConfigStore";
import {
  COLLECT_TEMPLATE_FILE_PATH,
  FIND_ENERGY_TEMPLATE_FILE_PATH,
} from "../types";

export function ConfigScreen() {
  const router = useRouter();
  const [collectTemplate, setCollectTemplate] = useState<string | null>(
    useConfigStore((state) => state.collectButtonTemplate),
  );
  const [findEnergyTemplate, setFindEnergyTemplate] = useState<string | null>(
    useConfigStore((state) => state.findEnergyButtonTemplate),
  );

  const handleSelectCollectTemplate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const savedPath = await saveFile(uri, COLLECT_TEMPLATE_FILE_PATH);
        setCollectTemplate(savedPath);
        showSuccessToast("采集按钮模板已保存");
      }
    } catch (error) {
      showErrorToast("保存失败，请重试");
      console.error("Failed to save collect template:", error);
    }
  };

  const handleSelectFindEnergyTemplate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const savedPath = await saveFile(uri, FIND_ENERGY_TEMPLATE_FILE_PATH);
        setFindEnergyTemplate(savedPath);
        showSuccessToast("找能量按钮模板已保存");
      }
    } catch (error) {
      showErrorToast("保存失败，请重试");
      console.error("Failed to save find energy template:", error);
    }
  };

  const handleClearCollectTemplate = () => {
    setCollectTemplate(null);
  };

  const handleClearFindEnergyTemplate = () => {
    setFindEnergyTemplate(null);
  };

  const handleSaveConfig = () => {
    if (!collectTemplate || !findEnergyTemplate) {
      showErrorToast("请先选择所有模板图片");
      return;
    }

    useConfigStore.setState({
      collectButtonTemplate: collectTemplate,
      findEnergyButtonTemplate: findEnergyTemplate,
    });

    showSuccessToast("配置已保存");
    router.back();
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          第一步：配置采集按钮
        </Text>
        <TemplatePicker
          title="采集按钮模板"
          subtitle="选择采集按钮的截图"
          templateUri={collectTemplate}
          onSelectTemplate={handleSelectCollectTemplate}
          onClearTemplate={handleClearCollectTemplate}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          第二步：配置找能量按钮
        </Text>
        <TemplatePicker
          title="找能量按钮模板"
          subtitle="选择找能量按钮的截图"
          templateUri={findEnergyTemplate}
          onSelectTemplate={handleSelectFindEnergyTemplate}
          onClearTemplate={handleClearFindEnergyTemplate}
        />

        <Button
          mode="contained"
          disabled={!collectTemplate || !findEnergyTemplate}
          onPress={handleSaveConfig}
          style={styles.saveButton}
        >
          保存配置
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginVertical: 16,
    fontWeight: "bold",
  },
  saveButton: {
    marginVertical: 24,
  },
});
