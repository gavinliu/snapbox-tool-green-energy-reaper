import * as FileSystem from 'expo-file-system';
import { ensureDir, saveFile, getFileInfo, deleteFile } from './fileSystem';

jest.mock('expo-file-system', () => ({
  documentDirectory: '/tmp/documents/',
  cacheDirectory: '/tmp/cache/',
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  copyAsync: jest.fn(),
  deleteAsync: jest.fn(),
  readDirectoryAsync: jest.fn(),
}));

describe('fileSystem utils', () => {
  beforeEach(() => {
    // 设置默认的mock返回值
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });
  });

  it('should ensure directory exists', async () => {
    await ensureDir('/tmp/test/');
    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith('/tmp/test/', { intermediates: true });
  });

  it('should save file to destination', async () => {
    await saveFile('/source/path', '/dest/path');
    expect(FileSystem.copyAsync).toHaveBeenCalledWith({ from: '/source/path', to: '/dest/path' });
  });

  it('should check if file exists', async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });
    const exists = await getFileInfo('/tmp/test.png');
    expect(exists).toBe(true);
  });
});
