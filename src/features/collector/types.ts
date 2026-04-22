export type CollectionStatus = 'idle' | 'collecting' | 'finished' | 'error';

export interface CollectionStatistics {
  totalCollected: number;
  successCount: number;
  failCount: number;
  startTime: number | null;
  endTime: number | null;
}

export interface CollectionReport {
  duration: string;
  totalFriends: number;
  successRate: string;
  averageTime: string;
  timestamp: string;
}

export interface CollectionConfig {
  collectButtonTemplate: string;
  findEnergyTemplate: string;
  matchingThreshold: number;
  operationDelay: number; // 3000ms
}

export interface CollectorState {
  isCollecting: boolean;
  currentStatus: CollectionStatus;
  statistics: CollectionStatistics;
  currentOperation: string | null;
}

export interface CollectorActions {
  startCollection: () => void;
  stopCollection: () => void;
  updateStatistics: (data: Partial<CollectionStatistics>) => void;
  setCurrentOperation: (operation: string | null) => void;
  resetStatistics: () => void;
}

export type CollectorStore = CollectorState & CollectorActions;
