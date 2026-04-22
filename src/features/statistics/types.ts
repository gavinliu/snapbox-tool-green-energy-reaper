import type { CollectionReport } from '../../collector/types';

// 直接使用 CollectionReport 作为显示数据类型，避免重复定义
export type StatisticsDisplayData = CollectionReport;

export interface StatisticsScreenParams {
  report: StatisticsDisplayData;
}
