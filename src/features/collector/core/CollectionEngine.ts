import * as ScreenClicker from "@snapbox/pkg-screen-clicker";
import * as ScreenRecorder from "@snapbox/pkg-screen-recorder";
import type { CollectionConfig, CollectionReport } from "../types";
import { delay } from "../utils/delay";
import TemplateMatcher from "./TemplateMatcher";

export default class CollectionEngine {
  private collecting = false;
  private recording = false;
  private collectFailCount = 0;
  private readonly MAX_COLLECT_FAILURES = 3;

  private statistics = {
    totalCollected: 0,
    successCount: 0,
    failCount: 0,
  };

  constructor(
    private config: CollectionConfig,
    private matcher: TemplateMatcher,
    private onProgress: (status: string) => void,
    private onComplete: (report: CollectionReport) => void,
  ) {}

  async initialize(): Promise<void> {
    if (this.recording) {
      return;
    }

    try {
      await ScreenRecorder.startRecording();
      this.recording = true;
    } catch (error) {
      console.error("启动录屏失败:", error);
      throw new Error(`启动录屏失败: ${error}`);
    }
  }

  async start(): Promise<void> {
    if (!this.recording) {
      this.onProgress("请先初始化录屏");
      throw new Error("请先初始化录屏");
    }

    this.collecting = true;
    this.collectFailCount = 0;

    try {
      while (this.collecting) {
        this.onProgress("正在采集好友能量...");

        // 1. 尝试采集当前好友
        const collectSuccess = await this.tryCollectEnergy();
        if (collectSuccess) {
          this.statistics.successCount++;
          this.collectFailCount = 0;
        } else {
          this.collectFailCount++;

          if (this.collectFailCount >= this.MAX_COLLECT_FAILURES) {
            // 连续失败3次，跳过当前好友
            this.onProgress("无法采集，跳过当前好友...");
            await this.tryFindNextFriend();
            this.statistics.totalCollected++;
            this.statistics.failCount++;
            this.collectFailCount = 0;
            continue;
          }
        }

        // 等待3秒
        await delay(this.config.operationDelay);

        // 2. 查找下一个好友
        this.onProgress("正在查找下一个好友...");
        const hasNextFriend = await this.tryFindNextFriend();

        if (hasNextFriend) {
          this.statistics.totalCollected++;
          await delay(this.config.operationDelay);
        } else {
          // 没有更多好友，结束采集
          this.onProgress("采集完成！");
          break;
        }
      }
    } catch (error) {
      console.error("采集过程出错:", error);
      this.onProgress(`采集出错: ${error}`);
    } finally {
      this.collecting = false;
      // 停止录屏
      await ScreenRecorder.stopRecording();
      this.recording = false;
      const report = this.generateReport();
      this.onComplete(report);
    }
  }

  stop(): void {
    this.collecting = false;
    this.onProgress("正在停止采集...");
  }

  private async tryCollectEnergy(): Promise<boolean> {
    const screenPath = await ScreenRecorder.captureScreen();
    console.log(`采集好友能量，截图路径: ${screenPath}`);
    const result = await this.matcher.findCollectButton(screenPath);
    console.log(`采集好友能量结果: ${result}`);

    if (result) {
      const centerX = result.x + result.width / 2;
      const centerY = result.y + result.height / 2;
      await ScreenClicker.tap(centerX, centerY);
      return true;
    }

    return false;
  }

  private async tryFindNextFriend(): Promise<boolean> {
    const screenPath = await ScreenRecorder.captureScreen();
    const result = await this.matcher.findFindEnergyButton(screenPath);

    if (result) {
      const centerX = result.x + result.width / 2;
      const centerY = result.y + result.height / 2;
      await ScreenClicker.tap(centerX, centerY);
      return true;
    }

    return false;
  }

  private generateReport(): CollectionReport {
    const startTime =
      Date.now() -
      this.statistics.totalCollected * this.config.operationDelay * 2;
    const endTime = Date.now();
    const duration = endTime - startTime;

    return {
      duration: this.formatDuration(duration),
      totalFriends: this.statistics.totalCollected,
      successRate: this.formatSuccessRate(),
      averageTime: this.formatAverageTime(duration),
      timestamp: new Date().toLocaleString("zh-CN"),
    };
  }

  private formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}分${seconds}秒`;
    }
    return `${seconds}秒`;
  }

  private formatSuccessRate(): string {
    if (this.statistics.totalCollected === 0) return "0.0%";
    const rate =
      (this.statistics.successCount / this.statistics.totalCollected) * 100;
    return `${rate.toFixed(1)}%`;
  }

  private formatAverageTime(totalDuration: number): string {
    if (this.statistics.totalCollected === 0) return "0.0秒";
    const avgMs = totalDuration / this.statistics.totalCollected;
    return `${(avgMs / 1000).toFixed(1)}秒`;
  }
}
