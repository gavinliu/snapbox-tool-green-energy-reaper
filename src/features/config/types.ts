import * as FileSystem from "expo-file-system";

export interface ConfigState {
  collectButtonTemplate: string | null;
  findEnergyButtonTemplate: string | null;
  matchingThreshold: number;
  isConfigComplete: boolean;
}

export interface ConfigActions {
  setCollectButtonTemplate: (path: string) => void;
  setFindEnergyButtonTemplate: (path: string) => void;
  setMatchingThreshold: (threshold: number) => void;
  clearConfig: () => void;
}

export type ConfigStore = ConfigState & ConfigActions;

export const TEMPLATE_DIR = `${FileSystem.Paths.document.uri}templates/`;
export const COLLECT_TEMPLATE_NAME = "collect_button_template.png";
export const FIND_ENERGY_TEMPLATE_NAME = "find_energy_button_template.png";

export const COLLECT_TEMPLATE_FILE_PATH = `${TEMPLATE_DIR}${COLLECT_TEMPLATE_NAME}`;
export const FIND_ENERGY_TEMPLATE_FILE_PATH = `${TEMPLATE_DIR}${FIND_ENERGY_TEMPLATE_NAME}`;
