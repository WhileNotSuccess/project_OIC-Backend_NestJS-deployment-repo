import * as fs from "fs";
import * as path from "path";
import { IFileService } from "src/batch/domain/filesystem/file.service";

export class FileService extends IFileService {
  getAllFiles(dir: string): string[] {
    const fileList: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    // files 내부에 있는 폴더들 목록을 받아옴
    // withFileTypes가 false면 그냥 파일이름의 문자열이 반환되지만
    // true일 경우 fs.Dirent 객체의 배열 형식으로 반환됨

    for (const entry of entries) {
      // 폴더, 파일
      const fullPath = path.join(dir, entry.name);
      // 루트 폴더 / 검색할 폴더,파일 join
      if (entry.isDirectory()) {
        // 폴더(디렉토리)인 경우
        fileList.push(...this.getAllFiles(fullPath));
        // getAllFiles를 재귀 함수처럼 호출하여 하위 파일 탐색
      } else {
        // 폴더가 아닌 경우 -> 파일
        fileList.push(fullPath); // 파일이면 추가
      }
    }

    return fileList;
  }
  deleteFiles(filePath: string[]): string[] {
    // 각 파일 삭제
    // 삭제 되지 않은 파일이름을 반환
    const CheckNotDeleted: string[] = [];
    filePath.forEach((item) => {
      try {
        fs.unlinkSync(item);
      } catch (e) {
        console.log(e);
        CheckNotDeleted.push(item);
      }
    });
    return CheckNotDeleted;
  }
  deleteEmptyDirectory(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      // 디렉토리일 경우 재귀 호출로 하위 파일 탐색
      if (entry.isDirectory()) {
        this.deleteEmptyDirectory(fullPath);

        // 최하위 디렉토리를 찾아, 현재 디렉토리가 비었으면 삭제
        const isNowEmpty = fs.readdirSync(fullPath).length === 0;
        if (isNowEmpty) {
          try {
            fs.rmdirSync(fullPath);
          } catch (e) {
            console.warn(`폴더 삭제 실패: ${fullPath}`, e);
          }
        }
      }
    }
  }
}
