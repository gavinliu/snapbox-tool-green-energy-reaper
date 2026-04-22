import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Appbar, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { saveFile } from '@/utils/fileSystem';
import { useConfigStore } from '../store/useConfigStore';
import { TEMPLATE_DIR, COLLECT_TEMPLATE_NAME, FIND_ENERGY_TEMPLATE_NAME } from '../types';
import { TemplatePicker } from '../components/TemplatePicker';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

export function ConfigScreen({ navigation }: any) {
  const [collectTemplate, setCollectTemplate] = useState<string | null>(
    useConfigStore((state) => state.collectButtonTemplate)
  );
  const [findEnergyTemplate, setFindEnergyTemplate] = useState<string | null>(
    useConfigStore((state) => state.findEnergyButtonTemplate)
  );

  const handleSelectCollectTemplate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const savedPath = await saveFile(uri, `${TEMPLATE_DIR}${COLLECT_TEMPLATE_NAME}`);
        setCollectTemplate(savedPath);
        showSuccessToast('采集按钮模板已保存');
      }
    } catch (error) {
      showErrorToast('保存失败，请重试');
      console.error('Failed to save collect template:', error);
    }
  };

  const handleSelectFindEnergyTemplate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const savedPath = await saveFile(uri, `${TEMPLATE_DIR}${FIND_ENERGY_TEMPLATE_NAME}`);
        setFindEnergyTemplate(savedPath);
        showSuccessToast('找能量按钮模板已保存');
      }
    } catch (error) {
      showErrorToast('保存失败，请重试');
      console.error('Failed to save find energy template:', error);
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
      showErrorToast('请先选择所有模板图片');
      return;
    }

    useConfigStore.getState().setCollectButtonTemplate(collectTemplate);
    useConfigStore.getState().setFindEnergyButtonTemplate(findEnergyTemplate);

    showSuccessToast('配置已保存');
    navigation.goBack();
  };

  const showConfigGuide = () => {
    Alert.alert(
      '配置指南',
      '请按以下步骤配置模板图片：\n\n1. 打开支付宝蚂蚁森林\n2. 进入一个好友的页面\n3. 确保能看到"采集"按钮\n4. 点击"选择图片"上传按钮截图\n5. 重复步骤配置"找能量"按钮',
      [{ text: '知道了' }]
    );
  };

  return (
    <View style={styles.root}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="配置模板" />
        <Appbar.Action icon="information-outline" onPress={showConfigGuide} />
      </Appbar.Header>

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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginVertical: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    marginVertical: 24,
  },
});
