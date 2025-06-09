export abstract class IFileService {
  abstract getAllFiles(dir: string): string[];
  abstract deleteFiles(filePath: string[]): string[];
  abstract deleteEmptyDirectory(dir: string): void;
}
