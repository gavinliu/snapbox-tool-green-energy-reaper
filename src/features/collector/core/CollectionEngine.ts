import * as ScreenClicker from "@snapbox/pkg-screen-clicker";
import ScreenRecorderModule, * as ScreenRecorder from "@snapbox/pkg-screen-recorder";
import { sleep } from "@snapbox/pkg-timer";
import { FloatingMenuController } from "../components/FloatingMenuController";
import { useCollectorStore } from "../store/useCollectorStore";
import type { CollectionStatus, RecordStatus } from "../types";
import TemplateMatcher from "./TemplateMatcher";

type ScreenRecorderError = {
  code: string;
  message: string;
};

type ScreenRecorderStop = {
  filePath: string;
};

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
    this.setupScreenRecorderListeners();
  }

  async toggleEngine() {
    if (this.recordStatus === "idle") {
      await this.startRecording();
    } else {
      await this.stopRecording();
    }
  }

  private setupScreenRecorderListeners() {
    ScreenRecorderModule.addListener(
      "onError",
      (error: ScreenRecorderError) => {
        console.error("ScreenRecorder 错误:", error);
        this.handleScreenRecorderStopOrErrorEvent();

        // 显示友好的错误提示
        const errorMessage = this.getErrorMessage(error.code, error.message);
        this.onProgress(`录屏异常: ${errorMessage}`);
      },
    );

    ScreenRecorderModule.addListener(
      "onStop",
      (payload: ScreenRecorderStop) => {
        console.log("ScreenRecorder 已停止:", payload.filePath);
        this.handleScreenRecorderStopOrErrorEvent();
      },
    );
  }

  private handleScreenRecorderStopOrErrorEvent() {
    // 停止采集循环（如果正在运行）
    if (this.checkCollectionIsRunning()) {
      this.stop();
    }

    // 更新状态为空闲
    this.recordStatus = "idle";
    useCollectorStore.getState().stopRecord();

    // 隐藏悬浮窗
    this.menuController?.hideMenu();
  }

  private getErrorMessage(code: string, message: string): string {
    const errorMessages: Record<string, string> = {
      PERMISSION_DENIED: "录屏权限被拒绝",
      RECORDING_LIMIT_REACHED: "达到录屏时长限制",
      SYSTEM_ERROR: "系统错误",
      UNKNOWN: "未知错误",
    };

    return errorMessages[code] || message || "未知错误";
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
      this.recordStatus = "idle";
      this.onProgress("启动录屏失败，请重试");
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
      // 即使停止录屏失败，也要确保状态正确
      this.recordStatus = "idle";
      useCollectorStore.getState().stopRecord();
      this.menuController?.hideMenu();
      this.onProgress("停止录屏时出现错误");
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
      this.onProgress("3s 后采集好友能量");
      await sleep(3000);

      try {
        await this.tryCollectEnergy();
      } catch (error) {
        // 如果采集失败，停止采集循环
        console.error("采集过程中出错，停止采集:", error);
        return;
      }

      // 检查是否停止采集
      if (!this.checkCollectionIsRunning()) {
        return;
      }

      // 2. 查找下一个好友
      this.onProgress("3s 后查找下一个好友");
      await sleep(3000);

      try {
        const hasNextFriend = await this.tryFindNextFriend();
        if (!hasNextFriend) {
          this.onProgress("没有更多好友，结束采集！");
          break;
        }
      } catch (error) {
        // 如果查找失败，停止采集循环
        console.error("查找好友过程中出错，停止采集:", error);
        return;
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
    try {
      const screenPath = await ScreenRecorder.captureScreen();
      const result = await this.matcher.findCollectButton(screenPath);

      if (result) {
        const centerX = result.x + result.width / 2;
        const centerY = result.y + result.height / 2;
        await ScreenClicker.tap(centerX, centerY);
        return true;
      }

      return false;
    } catch (error) {
      console.error("采集能量失败:", error);
      this.onProgress("采集能量失败，请检查录屏状态");
      throw error; // 重新抛出错误，让上层处理
    }
  }

  private async tryFindNextFriend(): Promise<boolean> {
    try {
      const screenPath = await ScreenRecorder.captureScreen();
      const result = await this.matcher.findFindEnergyButton(screenPath);

      if (result) {
        const centerX = result.x + result.width / 2;
        const centerY = result.y + result.height / 2;
        await ScreenClicker.tap(centerX, centerY);
        return true;
      }

      return false;
    } catch (error) {
      console.error("查找下一个好友失败:", error);
      this.onProgress("查找好友失败，请检查录屏状态");
      throw error; // 重新抛出错误，让上层处理
    }
  }

  private onProgress(status: string): void {
    this.menuController?.updateMenuItems(status);
  }
}

export const collectionEngine = new CollectionEngine();
