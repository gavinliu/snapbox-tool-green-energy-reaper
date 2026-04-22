import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';

interface TemplatePickerProps {
  title: string;
  subtitle: string;
  templateUri: string | null;
  onSelectTemplate: () => void;
  onClearTemplate: () => void;
}

export function TemplatePicker({
  title,
  subtitle,
  templateUri,
  onSelectTemplate,
  onClearTemplate,
}: TemplatePickerProps) {
  return (
    <Card mode="contained">
      <Card.Title title={title} subtitle={subtitle} />
      <Card.Content>
        {templateUri ? (
          <View>
            <Image
              source={{ uri: templateUri }}
              style={styles.preview}
              resizeMode="contain"
            />
            <Button
              mode="outlined"
              onPress={onClearTemplate}
              style={styles.button}
            >
              重新选择
            </Button>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={onSelectTemplate}
            style={styles.button}
          >
            选择图片
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  button: {
    marginTop: 8,
  },
});
