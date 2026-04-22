import ComputerVision from '@snapbox/pkg-computer-vision';
import type { MatchResult } from '@snapbox/pkg-computer-vision';
import type { CollectionConfig } from '../types';

export default class TemplateMatcher {
  constructor(private config: CollectionConfig) {}

  async findCollectButton(screenPath: string): Promise<MatchResult | null> {
    const results = await ComputerVision.findImage(
      screenPath,
      this.config.collectButtonTemplate,
      this.config.matchingThreshold
    );

    return this.getBestMatch(results);
  }

  async findFindEnergyButton(screenPath: string): Promise<MatchResult | null> {
    const results = await ComputerVision.findImage(
      screenPath,
      this.config.findEnergyTemplate,
      this.config.matchingThreshold
    );

    return this.getBestMatch(results);
  }

  private getBestMatch(results: MatchResult[]): MatchResult | null {
    if (results.length === 0) return null;

    return results.sort((a, b) => b.confidence - a.confidence)[0];
  }
}
