import * as FloatingMenu from "@snapbox/pkg-floating-menu";
import { useCollectorStore } from "../store/useCollectorStore";

export class FloatingMenuController {
  constructor(
    private onStart: () => void,
    private onStop: () => void,
  ) {}

  showMenu(): void {
    const isCollecting =
      useCollectorStore.getState().collectionStatus === "collecting";

    FloatingMenu.show([
      {
        title: "准备就绪",
        onPress: () => {}, // 状态显示项，不可操作
      },
      {
        title: isCollecting ? "停止采集" : "开始采集",
        onPress: () => {
          if (isCollecting) {
            this.onStop();
          } else {
            this.onStart();
          }
        },
      },
    ]);
  }

  hideMenu(): void {
    FloatingMenu.hide();
  }

  updateMenuItems(currentOperation: string | null = null): void {
    const isCollecting =
      useCollectorStore.getState().collectionStatus === "collecting";

    const items = [
      {
        title: currentOperation || "准备就绪",
        onPress: () => {}, // 状态显示项，不可操作
      },
      {
        title: isCollecting ? "停止采集" : "开始采集",
        onPress: () => {
          if (isCollecting) {
            this.onStop();
          } else {
            this.onStart();
          }
        },
      },
    ];

    FloatingMenu.show(items);
  }
}
