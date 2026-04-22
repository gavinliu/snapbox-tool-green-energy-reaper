import { renderHook, act } from '@testing-library/react-native';
import { useFloatingMenuStore } from './useFloatingMenuStore';

describe('useFloatingMenuStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFloatingMenuStore());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.overlayPermissionGranted).toBe(false);
  });

  it('should show menu', () => {
    const { result } = renderHook(() => useFloatingMenuStore());

    act(() => {
      result.current.showMenu();
    });

    expect(result.current.isVisible).toBe(true);
  });

  it('should hide menu', () => {
    const { result } = renderHook(() => useFloatingMenuStore());

    act(() => {
      result.current.showMenu();
      result.current.hideMenu();
    });

    expect(result.current.isVisible).toBe(false);
  });

  it('should set permission granted', () => {
    const { result } = renderHook(() => useFloatingMenuStore());

    act(() => {
      result.current.setPermissionGranted(true);
    });

    expect(result.current.overlayPermissionGranted).toBe(true);
  });
});
