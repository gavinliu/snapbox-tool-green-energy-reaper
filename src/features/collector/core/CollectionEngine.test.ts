import CollectionEngine from './CollectionEngine';
import * as ScreenRecorder from '@snapbox/pkg-screen-recorder';
import * as ScreenClicker from '@snapbox/pkg-screen-clicker';
import TemplateMatcher from './TemplateMatcher';

jest.mock('@snapbox/pkg-screen-recorder');
jest.mock('@snapbox/pkg-screen-clicker');
jest.mock('./TemplateMatcher');

describe('CollectionEngine', () => {
  let engine: CollectionEngine;
  let mockMatcher: jest.Mocked<TemplateMatcher>;
  const mockConfig = {
    collectButtonTemplate: '/path/to/collect.png',
    findEnergyTemplate: '/path/to/find.png',
    matchingThreshold: 0.8,
    operationDelay: 100, // 测试用短延迟
  };

  beforeEach(() => {
    mockMatcher = {
      findCollectButton: jest.fn(),
      findFindEnergyButton: jest.fn(),
    } as any;

    engine = new CollectionEngine(
      mockConfig,
      mockMatcher,
      jest.fn(), // onProgress
      jest.fn()  // onComplete
    );
  });

  it('should complete collection cycle successfully', async () => {
    const mockCollectMatch = { x: 100, y: 200, width: 50, height: 30, confidence: 0.9 };
    const mockFindMatch = { x: 300, y: 400, width: 60, height: 40, confidence: 0.85 };

    mockMatcher.findCollectButton.mockResolvedValue(mockCollectMatch);
    mockMatcher.findFindEnergyButton.mockResolvedValue(mockFindMatch);

    (ScreenRecorder.captureScreen as jest.Mock)
      .mockResolvedValue('/screen1.png')
      .mockResolvedValue('/screen2.png')
      .mockResolvedValue('/screen3.png');

    (ScreenClicker.tap as jest.Mock).mockResolvedValue(true);

    const onProgress = jest.fn();
    const onComplete = jest.fn();
    engine = new CollectionEngine(mockConfig, mockMatcher, onProgress, onComplete);

    // 模拟两次循环后找不到下一个好友
    mockMatcher.findFindEnergyButton
      .mockResolvedValueOnce(mockFindMatch)
      .mockResolvedValueOnce(mockFindMatch)
      .mockResolvedValueOnce(null);

    await engine.start();

    expect(onComplete).toHaveBeenCalled();
    expect(ScreenClicker.tap).toHaveBeenCalledTimes(5); // 2次采集 + 2次找能量 + 1次失败尝试
  }, 15000); // 增加超时时间到15秒

  it('should handle collection failure and complete', async () => {
    // 测试采集失败但成功结束的流程
    mockMatcher.findCollectButton.mockResolvedValue(null); // 总是失败

    // 第一次找能量成功，第二次失败，触发结束
    mockMatcher.findFindEnergyButton
      .mockResolvedValueOnce({ x: 300, y: 400, width: 60, height: 40, confidence: 0.85 })
      .mockResolvedValueOnce(null);

    (ScreenRecorder.captureScreen as jest.Mock).mockResolvedValue('/screen.png');
    (ScreenClicker.tap as jest.Mock).mockResolvedValue(true);

    const onProgress = jest.fn();
    const onComplete = jest.fn();
    engine = new CollectionEngine(mockConfig, mockMatcher, onProgress, onComplete);

    await engine.start();

    // 验证流程完成
    expect(onComplete).toHaveBeenCalled();
    expect(mockMatcher.findCollectButton).toHaveBeenCalled();
    expect(mockMatcher.findFindEnergyButton).toHaveBeenCalled();
  }, 15000); // 增加超时时间到15秒
});
