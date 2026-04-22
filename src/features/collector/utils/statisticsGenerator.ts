import type { CollectionStatistics, CollectionReport } from '../../types';

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}分${seconds}秒`;
  }
  return `${seconds}秒`;
}

export function formatSuccessRate(success: number, total: number): string {
  if (total === 0) return '0.0%';
  return `${((success / total) * 100).toFixed(1)}%`;
}

export function formatAverageTime(durationMs: number, total: number): string {
  if (total === 0) return '0.0秒';
  const avgMs = durationMs / total;
  return `${(avgMs / 1000).toFixed(1)}秒`;
}

export function generateReport(statistics: CollectionStatistics): CollectionReport {
  const duration = statistics.startTime && statistics.endTime
    ? statistics.endTime - statistics.startTime
    : 0;

  return {
    duration: formatDuration(duration),
    totalFriends: statistics.totalCollected,
    successRate: formatSuccessRate(statistics.successCount, statistics.totalCollected),
    averageTime: formatAverageTime(duration, statistics.totalCollected),
    timestamp: new Date().toLocaleString('zh-CN'),
  };
}
