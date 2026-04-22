import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Appbar, Text } from 'react-native-paper';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StatisticsScreenParams } from '../types';
import { StatCard } from '../components/StatCard';

interface StatisticsScreenProps {
  route: RouteProp<{ params: StatisticsScreenParams }, 'params'>;
  navigation: NativeStackNavigationProp<any>;
}

export function StatisticsScreen({ route, navigation }: StatisticsScreenProps) {
  const { report } = route.params;

  return (
    <View style={styles.root}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="采集统计" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          采集概览
        </Text>

        <StatCard label="采集时长" value={report.duration} />
        <StatCard label="处理好友" value={`${report.totalFriends}个`} />
        <StatCard label="成功率" value={report.successRate} />
        <StatCard label="平均耗时" value={`${report.averageTime}/好友`} />

        <Text variant="bodySmall" style={styles.timestamp}>
          完成时间：{report.timestamp}
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          确定
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
  timestamp: {
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#999',
  },
  closeButton: {
    marginVertical: 24,
  },
});
