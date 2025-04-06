import { Test, TestingModule } from "@nestjs/testing";
import { LocalMediaService } from "./local-media.service";
import * as path from "path";
import * as fs from "fs";
import { Readable } from "stream";
import * as fileType from "file-type";

describe("LocalMediaService", () => {
  let mockImages: Express.Multer.File[];
  let badImages: Express.Multer.File[];
  let mockFiles: Express.Multer.File[];
  let badFiles: Express.Multer.File[];

  let service: LocalMediaService;
  let savedPath: string;
  const getTestDir = (folder: string) => {
    return path.resolve(__dirname, "../../../../files", folder);
  };
  const createMulterFile = (
    buffer: Buffer,
    originalname: string,
    mimetype: string,
  ): Express.Multer.File => {
    return {
      fieldname: "file",
      originalname,
      encoding: "7bit",
      mimetype,
      size: buffer.length,
      buffer,
      destination: "",
      filename: "",
      path: "",
      stream: Readable.from(buffer),
    };
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalMediaService],
    }).compile();

    service = module.get<LocalMediaService>(LocalMediaService);
  });
  beforeAll(async () => {
    await fs.promises.rm(getTestDir("test-image"), {
      recursive: true,
      force: true,
    });
    await fs.promises.rm(getTestDir("test-file"), {
      recursive: true,
      force: true,
    });
    const badFilePath = path.resolve(
      __dirname,
      "../../../test/__fixtures__/attachment/bad",
    );
    const goodFilePath = path.resolve(
      __dirname,
      "../../../test/__fixtures__/attachment/good",
    );
    const badImagePath = path.resolve(
      __dirname,
      "../../../test/__fixtures__/image/bad",
    );
    const goodImagePath = path.resolve(
      __dirname,
      "../../../test/__fixtures__/image/good",
    );

    const badFileNames = await fs.promises.readdir(badFilePath);
    const goodFileNames = await fs.promises.readdir(goodFilePath);
    const badImageNames = await fs.promises.readdir(badImagePath);
    const goodImageNames = await fs.promises.readdir(goodImagePath);

    const badFileBuffers = badFileNames.map((item) => {
      return {
        originalname: item,
        buffer: fs.readFileSync(path.resolve(badFilePath, item)),
      };
    });
    const goodFileBuffers = goodFileNames.map((item) => {
      return {
        originalname: item,
        buffer: fs.readFileSync(path.resolve(goodFilePath, item)),
      };
    });
    const badImageBuffers = badImageNames.map((item) => {
      return {
        originalname: item,
        buffer: fs.readFileSync(path.resolve(badImagePath, item)),
      };
    });
    const goodImageBuffers = goodImageNames.map((item) => {
      return {
        originalname: item,
        buffer: fs.readFileSync(path.resolve(goodImagePath, item)),
      };
    });

    badFiles = await Promise.all(
      badFileBuffers.map(async (item) => {
        const type = await fileType.fromBuffer(item.buffer);
        if (!type) {
          console.log(item.originalname);
          throw new Error("타입 판별 실패");
        }
        return createMulterFile(item.buffer, item.originalname, type.mime);
      }),
    );
    mockFiles = await Promise.all(
      goodFileBuffers.map(async (item) => {
        const type = await fileType.fromBuffer(item.buffer);
        if (!type) {
          console.log(item.originalname);
          throw new Error("타입 판별 실패");
        }
        return createMulterFile(item.buffer, item.originalname, type.mime);
      }),
    );

    badImages = await Promise.all(
      badImageBuffers.map(async (item) => {
        const type = await fileType.fromBuffer(item.buffer);
        if (!type) {
          console.log(item.originalname);
          throw new Error("타입 판별 실패");
        }
        return createMulterFile(item.buffer, item.originalname, type.mime);
      }),
    );

    mockImages = await Promise.all(
      goodImageBuffers.map(async (item) => {
        const type = await fileType.fromBuffer(item.buffer);
        if (!type) {
          console.log(item.originalname);
          throw new Error("타입 판별 실패");
        }
        return createMulterFile(item.buffer, item.originalname, type.mime);
      }),
    );
  });
  afterAll(async () => {
    await fs.promises.rm(getTestDir("test-image"), {
      recursive: true,
      force: true,
    });
    await fs.promises.rm(getTestDir("test-file"), {
      recursive: true,
      force: true,
    });
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("upload image", () => {
    it("should save a image file and return url", async () => {
      const result = await service.uploadImage(mockImages[0], "test-image");
      expect(result).toMatch(new RegExp(`^/files/test-image/.+`));

      savedPath = path.resolve(getTestDir("test-image"), path.basename(result));
      const exists = fs.existsSync(savedPath);
      expect(exists).toBe(true);
    });
  });

  describe("delete image files", () => {
    it("should delete media file", async () => {
      const target = mockImages.map(async (item) => {
        return await service.uploadImage(item, "test-image");
      });
      const savedFileNames = await Promise.all(target);
      await service.delete(savedFileNames);

      const deletedDir = await fs.promises.readdir(getTestDir("test-image"));

      expect(deletedDir.length).toEqual(1);

      await fs.promises.unlink(savedPath);

      const testDir = await fs.promises.readdir(getTestDir("test-image"));

      expect(testDir.length).toEqual(0);
    });
  });

  describe("upload file", () => {
    it("should save a attachment file and return data", async () => {
      const result = await service.uploadAttachment(mockFiles[0], "test-file");
      expect(result.url).toMatch(new RegExp(`^/files/test-file/.+`));

      savedPath = path.resolve(
        getTestDir("test-file"),
        path.basename(result.url),
      );
      const exists = fs.existsSync(savedPath);
      expect(exists).toBe(true);
    });
  });

  describe("delete files", () => {
    it("should allow files and delete", async () => {
      const uploading = mockFiles.map(async (item) => {
        return await service.uploadAttachment(item, "test-file");
      });

      const uploadedFiles = await Promise.all(uploading);

      expect(uploadedFiles.length).toEqual(mockFiles.length);
      expect(
        uploadedFiles.map((item) => {
          return item.originalname;
        }),
      ).toMatchObject(mockFiles.map((item) => item.originalname));

      const fileNames = await fs.promises.readdir(getTestDir("test-file"));
      expect(fileNames.length).toEqual(mockFiles.length + 1);

      const targetPath = fileNames.map((item) =>
        path.resolve(getTestDir("test-file"), item),
      );

      await service.delete(targetPath);

      const afterDeleteFileNames = await fs.promises.readdir(
        getTestDir("test-file"),
      );
      expect(afterDeleteFileNames.length).toEqual(0);
    });
  });

  describe("MediaValidator", () => {
    it("should deny file", async () => {
      for (const file of badFiles) {
        await expect(
          service.uploadAttachment(file, "test-file"),
        ).rejects.toThrow();
      }
    });
    it("should deny image", async () => {
      for (const image of badImages) {
        await expect(service.uploadImage(image, "test-file")).rejects.toThrow();
      }
    });
  });
});
