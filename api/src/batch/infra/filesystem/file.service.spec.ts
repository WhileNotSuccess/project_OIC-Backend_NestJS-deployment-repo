import * as fs from "fs";
import * as path from "path";
import { FileService } from "./file.service";

jest.mock("fs");
jest.mock("path");

describe("FileService", () => {
  let fileService: FileService;

  beforeEach(() => {
    fileService = new FileService();
    jest.clearAllMocks();
  });

  describe("getAllFiles", () => {
    it("should recursively get all files from directories", () => {
      //fs.Dirent 객체 배열 형태
      const mockDirStructure = {
        "/files": [
          { name: "subfolder", isDirectory: () => true },
          { name: "file1.txt", isDirectory: () => false },
        ],
        "/files/subfolder": [{ name: "file2.txt", isDirectory: () => false }],
      };

      (fs.readdirSync as jest.Mock).mockImplementation(
        (dir: string): fs.Dirent[] => mockDirStructure[dir],
      );
      (path.join as jest.Mock).mockImplementation((...args: string[]) =>
        args.join("/"),
      );

      const result = fileService.getAllFiles("/files");

      expect(result).toStrictEqual([
        "/files/subfolder/file2.txt",
        "/files/file1.txt",
      ]);
    });
  });

  describe("deleteFiles", () => {
    it("should delete files and return empty array if all deletions succeed", () => {
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

      const result = fileService.deleteFiles(["file1.txt", "file2.txt"]);
      expect(result).toEqual([]);
      expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
    });

    it("should return files that failed to delete", () => {
      (fs.unlinkSync as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error("fail");
        })
        .mockImplementationOnce(() => {});

      const result = fileService.deleteFiles(["fail1.txt", "success.txt"]);
      expect(result).toEqual(["fail1.txt"]);
      expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
    });
  });

  describe("deleteEmptyDirectory", () => {
    it("should recursively delete empty directories", () => {
      const mockFs = {
        "/files": [{ name: "empty1", isDirectory: () => true }],
        "/files/empty1": [],
      };

      (fs.readdirSync as jest.Mock).mockImplementation(
        (dir: string): fs.Dirent[] => mockFs[dir] || [],
      );
      (fs.rmdirSync as jest.Mock).mockImplementation(() => {});
      (path.join as jest.Mock).mockImplementation((...args: string[]) =>
        args.join("/"),
      );

      fileService.deleteEmptyDirectory("/files");

      expect(fs.readdirSync).toHaveBeenCalledWith("/files", {
        withFileTypes: true,
      });
      expect(fs.readdirSync).toHaveBeenCalledWith("/files/empty1");
      expect(fs.rmdirSync).toHaveBeenCalledWith("/files/empty1");
    });

    it("should handle failure to delete directory gracefully", () => {
      const mockFs = {
        "/files": [{ name: "empty2", isDirectory: () => true }],
        "/files/empty2": [],
      };

      (fs.readdirSync as jest.Mock).mockImplementation(
        (dir: string): fs.Dirent[] => mockFs[dir] || [],
      );
      (fs.rmdirSync as jest.Mock).mockImplementation(() => {
        throw new Error("delete failed");
      });
      (path.join as jest.Mock).mockImplementation((...args: string[]) =>
        args.join("/"),
      );

      expect(() => fileService.deleteEmptyDirectory("/files")).not.toThrow();
    });
  });
});
