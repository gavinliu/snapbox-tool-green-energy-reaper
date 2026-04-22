import * as FileSystem from 'expo-file-system';

export async function ensureDir(path: string): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(path);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

export async function saveFile(sourceUri: string, destPath: string): Promise<string> {
  await ensureDir(destPath.substring(0, destPath.lastIndexOf('/')));
  await FileSystem.copyAsync({ from: sourceUri, to: destPath });
  return destPath;
}

export async function getFileInfo(path: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(path);
  return info.exists;
}

export async function deleteFile(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) {
    await FileSystem.deleteAsync(path);
  }
}

export async function cleanupOldFiles(directory: string, prefix: string, maxAge: number): Promise<void> {
  const files = await FileSystem.readDirectoryAsync(directory);

  for (const file of files) {
    if (file.startsWith(prefix)) {
      const filePath = `${directory}${file}`;
      const info = await FileSystem.getInfoAsync(filePath);

      if (info.exists && 'modificationTime' in info) {
        const age = Date.now() - (info.modificationTime || 0);
        if (age > maxAge) {
          await FileSystem.deleteAsync(filePath);
        }
      }
    }
  }
}
