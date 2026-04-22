import * as ScreenClicker from "@snapbox/pkg-screen-clicker";
import * as ScreenRecorder from "@snapbox/pkg-screen-recorder";
import { sleep } from "@snapbox/pkg-timer";
import { FloatingMenuController } from "../components/FloatingMenuController";
import { useCollectorStore } from "../store/useCollectorStore";
import type { CollectionStatus, RecordStatus } from "../types";
import TemplateMatcher from "./TemplateMatcher";

class CollectionEngine {
  private menuController: FloatingMenuController | null = null;
  private matcher: TemplateMatcher = new TemplateMatcher();
  private recordStatus: RecordStatus = "idle";
  private collectionStatus: CollectionStatus = "idle";

  constructor() {
    this.recordStatus = "idle";
    this.collectionStatus = "idle";
    this.menuController = new FloatingMenuController(
      () => this.start(), // 开始采集 loop
      () => this.stop(), // 停止采集 loop
    );
  }

  async toggleEngine() {
    if (this.recordStatus === "idle") {
      await this.startRecording();
    } else {
      await this.stopRecording();
    }
  }

  private async startRecording() {
    try {
      // 1. 启动录屏
      await ScreenRecorder.startRecording();
      this.recordStatus = "recording";
      useCollectorStore.getState().startRecord();

      // 2. 显示悬浮窗
      this.menuController?.showMenu();

      // 3. 提示用户打开好友列表页
      this.onProgress("准备就绪");
    } catch (error) {
      console.error("启动录屏失败:", error);
    }
  }

  private async stopRecording() {
    try {
      // 1. 停止录屏
      await ScreenRecorder.stopRecording();
      this.recordStatus = "idle";
      useCollectorStore.getState().stopRecord();

      // 2. 隐藏悬浮窗
      this.menuController?.hideMenu();

      // 3. 停止采集 loop
      if (this.checkCollectionIsRunning()) {
        this.stop();
      }
    } catch (error) {
      console.error("停止录屏失败:", error);
    }
  }

  private async start(): Promise<void> {
    try {
      this.collectionStatus = "collecting";
      useCollectorStore.getState().startCollection();
      await this.doLoop();
    } catch (error) {
      this.onProgress(`采集出错: ${error}`);
    } finally {
      this.collectionStatus = "idle";
      useCollectorStore.getState().stoppedCollection();
      this.onProgress("采集完成！");
    }
  }

  private async doLoop() {
    do {
      // 1. 尝试采集当前好友
      this.onProgress("3s 后尝试采集好友能量...");
      await sleep(3000);
      const collectSuccess = await this.tryCollectEnergy();
      if (collectSuccess) {
        this.onProgress("3s 后继续采集下一个好友");
      } else {
        this.onProgress("3s 后继续采集下一个好友");
      }

      // 检查是否停止采集
      if (!this.checkCollectionIsRunning()) {
        return;
      }

      // 2. 查找下一个好友
      await sleep(3000);
      const hasNextFriend = await this.tryFindNextFriend();
      if (hasNextFriend) {
        this.onProgress("成功找到下一个好友！");
      } else {
        this.onProgress("没有更多好友，结束采集！");
        break;
      }
    } while (this.checkCollectionIsRunning());
  }

  private checkCollectionIsRunning(): boolean {
    return this.collectionStatus == "collecting";
  }

  private stop(): void {
    this.collectionStatus = "stopping";
    useCollectorStore.getState().stoppingCollection();
    this.onProgress("正在停止采集...");
  }

  private async tryCollectEnergy(): Promise<boolean> {
    const screenPath = await ScreenRecorder.captureScreen();
    const result = await this.matcher.findCollectButton(screenPath);

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

  private onProgress(status: string): void {
    this.menuController?.updateMenuItems(status);
  }
}

export const collectionEngine = new CollectionEngine();
