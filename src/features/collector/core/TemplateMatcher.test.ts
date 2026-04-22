import TemplateMatcher from './TemplateMatcher';
import ComputerVision from '@snapbox/pkg-computer-vision';

jest.mock('@snapbox/pkg-computer-vision');

describe('TemplateMatcher', () => {
  let matcher: TemplateMatcher;
  const mockConfig = {
    collectButtonTemplate: '/path/to/collect.png',
    findEnergyTemplate: '/path/to/find.png',
    matchingThreshold: 0.8,
    operationDelay: 3000,
  };

  beforeEach(() => {
    matcher = new TemplateMatcher(mockConfig);
    jest.clearAllMocks();
  });

  it('should find collect button template', async () => {
    const mockResults = [{ x: 100, y: 200, width: 50, height: 30, confidence: 0.9 }];
    (ComputerVision.findImage as jest.Mock).mockResolvedValue(mockResults);

    const result = await matcher.findCollectButton('/screen.png');

    expect(result).toEqual(mockResults[0]);
    expect(ComputerVision.findImage).toHaveBeenCalledWith('/screen.png', mockConfig.collectButtonTemplate, 0.8);
  });

  it('should return null when no match found', async () => {
    (ComputerVision.findImage as jest.Mock).mockResolvedValue([]);

    const result = await matcher.findCollectButton('/screen.png');

    expect(result).toBeNull();
  });

  it('should select best match from multiple results', async () => {
    const mockResults = [
      { x: 100, y: 200, width: 50, height: 30, confidence: 0.7 },
      { x: 150, y: 250, width: 50, height: 30, confidence: 0.95 },
    ];
    (ComputerVision.findImage as jest.Mock).mockResolvedValue(mockResults);

    const result = await matcher.findCollectButton('/screen.png');

    expect(result.confidence).toBe(0.95);
  });

  it('should find find-energy button template', async () => {
    const mockResults = [{ x: 300, y: 400, width: 60, height: 40, confidence: 0.85 }];
    (ComputerVision.findImage as jest.Mock).mockResolvedValue(mockResults);

    const result = await matcher.findFindEnergyButton('/screen.png');

    expect(result).toEqual(mockResults[0]);
  });
});
