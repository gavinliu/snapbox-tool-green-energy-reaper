import { generateReport, formatDuration } from './statisticsGenerator';
import type { CollectionStatistics } from '../../types';

describe('statisticsGenerator', () => {
  it('should format duration correctly', () => {
    expect(formatDuration(1000)).toBe('1秒');
    expect(formatDuration(65000)).toBe('1分5秒');
    expect(formatDuration(3661000)).toBe('61分1秒');
  });

  it('should generate report from statistics', () => {
    const stats: CollectionStatistics = {
      totalCollected: 10,
      successCount: 8,
      failCount: 2,
      startTime: 1000000,
      endTime: 1060000, // 60秒后
    };

    const report = generateReport(stats);

    expect(report.duration).toBe('1分0秒');
    expect(report.totalFriends).toBe(10);
    expect(report.successRate).toBe('80.0%');
    expect(report.averageTime).toBe('6.0秒');
  });

  it('should handle incomplete statistics', () => {
    const stats: CollectionStatistics = {
      totalCollected: 0,
      successCount: 0,
      failCount: 0,
      startTime: null,
      endTime: null,
    };

    const report = generateReport(stats);

    expect(report.duration).toBe('0秒');
    expect(report.totalFriends).toBe(0);
  });
});
