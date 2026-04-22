import {
  COLLECT_TEMPLATE_FILE_PATH,
  FIND_ENERGY_TEMPLATE_FILE_PATH,
} from "@/features/config/types";
import type { MatchResult } from "@snapbox/pkg-computer-vision";
import ComputerVision from "@snapbox/pkg-computer-vision";

export default class TemplateMatcher {
  async findCollectButton(screenPath: string): Promise<MatchResult | null> {
    const results = await ComputerVision.findImage(
      screenPath,
      COLLECT_TEMPLATE_FILE_PATH,
      0.8,
    );

    return this.getBestMatch(results);
  }

  async findFindEnergyButton(screenPath: string): Promise<MatchResult | null> {
    const results = await ComputerVision.findImage(
      screenPath,
      FIND_ENERGY_TEMPLATE_FILE_PATH,
      0.8,
    );

    return this.getBestMatch(results);
  }

  private getBestMatch(results: MatchResult[]): MatchResult | null {
    if (results.length === 0) return null;

    return results.sort((a, b) => b.confidence - a.confidence)[0];
  }
}
