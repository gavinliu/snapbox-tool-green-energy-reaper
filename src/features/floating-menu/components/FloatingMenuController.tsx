import * as FloatingMenu from '@snapbox/pkg-floating-menu';
import { useCollectorStore } from '../../collector/store/useCollectorStore';
import { useFloatingMenuStore } from '../store/useFloatingMenuStore';

export class FloatingMenuController {
  private isCollecting = false;

  constructor(
    private onStart: () => void,
    private onStop: () => void
  ) {}

  showMenu(): void {
    this.updateMenuState();
    FloatingMenu.show([
      {
        title: '准备就绪',
        onPress: () => {}, // 状态显示项，不可操作
      },
      {
        title: this.isCollecting ? '停止采集' : '开始采集',
        onPress: () => {
          if (this.isCollecting) {
            this.onStop();
          } else {
            this.onStart();
          }
          this.updateMenuState();
        },
      },
    ]);
    useFloatingMenuStore.getState().showMenu();
  }

  hideMenu(): void {
    FloatingMenu.hide();
    useFloatingMenuStore.getState().hideMenu();
  }

  updateMenuState(): void {
    this.isCollecting = useCollectorStore.getState().isCollecting;
  }

  updateMenuItems(currentOperation: string | null): void {
    this.updateMenuState();

    const items = [
      {
        title: currentOperation || '准备就绪',
        onPress: () => {}, // 状态显示项，不可操作
      },
      {
        title: this.isCollecting ? '停止采集' : '开始采集',
        onPress: () => {
          if (this.isCollecting) {
            this.onStop();
          } else {
            this.onStart();
          }
          this.updateMenuState();
        },
      },
    ];

    FloatingMenu.show(items);
  }
}
