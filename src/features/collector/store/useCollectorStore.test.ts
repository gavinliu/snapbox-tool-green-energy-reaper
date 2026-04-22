import { renderHook, act } from '@testing-library/react-native';
import { useCollectorStore } from './useCollectorStore';

describe('useCollectorStore', () => {
  beforeEach(() => {
    useCollectorStore.getState().resetStatistics();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCollectorStore());

    expect(result.current.isCollecting).toBe(false);
    expect(result.current.currentStatus).toBe('idle');
    expect(result.current.statistics.totalCollected).toBe(0);
  });

  it('should start collection', () => {
    const { result } = renderHook(() => useCollectorStore());

    act(() => {
      result.current.startCollection();
    });

    expect(result.current.isCollecting).toBe(true);
    expect(result.current.currentStatus).toBe('collecting');
  });

  it('should update statistics', () => {
    const { result } = renderHook(() => useCollectorStore());

    act(() => {
      result.current.updateStatistics({ successCount: 5 });
    });

    expect(result.current.statistics.successCount).toBe(5);
  });

  it('should reset statistics', () => {
    const { result } = renderHook(() => useCollectorStore());

    act(() => {
      result.current.updateStatistics({ successCount: 10, failCount: 2 });
      result.current.resetStatistics();
    });

    expect(result.current.statistics.successCount).toBe(0);
    expect(result.current.statistics.failCount).toBe(0);
  });
});
