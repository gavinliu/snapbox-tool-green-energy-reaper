export type RecordStatus = "idle" | "recording";
export type CollectionStatus = "idle" | "collecting" | "stopping";

export interface CollectionConfig {
  collectButtonTemplate: string;
  findEnergyTemplate: string;
  matchingThreshold: number;
  operationDelay: number; // 3000ms
}

export interface CollectorState {
  recordStatus: RecordStatus;
  collectionStatus: CollectionStatus;
}

export interface CollectorActions {
  startCollection: () => void;
  stoppingCollection: () => void;
  stoppedCollection: () => void;

  startRecord: () => void;
  stopRecord: () => void;
}

export type CollectorStore = CollectorState & CollectorActions;
