import { renderHook, act } from '@testing-library/react-native';
import { useConfigStore } from './useConfigStore';

describe('useConfigStore', () => {
  beforeEach(() => {
    // 重置store状态
    useConfigStore.getState().clearConfig();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useConfigStore());

    expect(result.current.collectButtonTemplate).toBeNull();
    expect(result.current.findEnergyButtonTemplate).toBeNull();
    expect(result.current.matchingThreshold).toBe(0.8);
    expect(result.current.isConfigComplete).toBe(false);
  });

  it('should set collect button template', () => {
    const { result } = renderHook(() => useConfigStore());

    act(() => {
      result.current.setCollectButtonTemplate('/path/to/template.png');
    });

    expect(result.current.collectButtonTemplate).toBe('/path/to/template.png');
  });

  it('should mark config as complete when both templates are set', () => {
    const { result } = renderHook(() => useConfigStore());

    act(() => {
      result.current.setCollectButtonTemplate('/path/to/collect.png');
      result.current.setFindEnergyButtonTemplate('/path/to/find.png');
    });

    expect(result.current.isConfigComplete).toBe(true);
  });

  it('should clear config', () => {
    const { result } = renderHook(() => useConfigStore());

    act(() => {
      result.current.setCollectButtonTemplate('/path/to/collect.png');
      result.current.clearConfig();
    });

    expect(result.current.collectButtonTemplate).toBeNull();
    expect(result.current.isConfigComplete).toBe(false);
  });
});
