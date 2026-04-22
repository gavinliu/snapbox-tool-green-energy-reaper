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
      {
        title: '关闭菜单',
        onPress: () => {
          FloatingMenu.hide();
          useFloatingMenuStore.getState().hideMenu();
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

    const title = currentOperation
      ? `${currentOperation} - ${this.isCollecting ? '停止' : '开始'}`
      : (this.isCollecting ? '停止采集' : '开始采集');

    FloatingMenu.show([
      {
        title,
        onPress: () => {
          if (this.isCollecting) {
            this.onStop();
          } else {
            this.onStart();
          }
          this.updateMenuState();
        },
      },
      {
        title: '关闭菜单',
        onPress: () => {
          FloatingMenu.hide();
          useFloatingMenuStore.getState().hideMenu();
        },
      },
    ]);
  }
}
