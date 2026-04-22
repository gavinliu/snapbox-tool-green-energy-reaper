/**
 * 权限状态类型定义
 */
export interface PermissionStatus {
  overlayPermission: boolean;
  screenClickerPermission: boolean;
  isAllGranted: boolean;
}

/**
 * 权限检查工具类
 *
 * 注意：由于React Hooks只能在函数组件中调用，
 * 实际的权限检查应该在组件内部使用 useOverlayPermissions 和 useScreenClickerPermissions hooks
 *
 * 这个工具类提供类型定义和辅助函数
 */
export class PermissionHelper {
  /**
   * 根据权限状态生成缺失权限的提示消息
   */
  static getPermissionMissingMessage(status: PermissionStatus): string | null {
    if (status.isAllGranted) return null;

    const missing = [];
    if (!status.overlayPermission) missing.push('悬浮窗权限');
    if (!status.screenClickerPermission) missing.push('屏幕点击权限');

    return `请先授权以下权限：${missing.join('、')}`;
  }

  /**
   * 创建权限状态对象
   */
  static createStatus(
    overlayPermission: boolean,
    screenClickerPermission: boolean
  ): PermissionStatus {
    return {
      overlayPermission,
      screenClickerPermission,
      isAllGranted: overlayPermission && screenClickerPermission,
    };
  }
}
