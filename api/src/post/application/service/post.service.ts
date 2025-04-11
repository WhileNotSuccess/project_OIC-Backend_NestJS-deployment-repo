import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreatePostDto } from "../dto/create-post.dto";
import { UpdatePostDto } from "../dto/update-post.dto";
import { PostRepository } from "src/post/domain/repository/post.repository";
import { searchTarget } from "src/post/domain/types/searchTarget";
import { MediaService } from "src/media/domain/media.service";
import { Language } from "src/post/domain/types/language";

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly mediaService: MediaService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    userId: number,
    files: Express.Multer.File[],
  ) {
    // 이미지 추출 및 메타데이터 저장
    const regex = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
    const createFilenames: string[] = [];
    let match: RegExpExecArray | null;
    if ((match = regex.exec(createPostDto.content)) !== null) {
      createFilenames.push(
        match[1].replace(`${process.env.BACKEND_URL}/files`, ""),
      );
    }
    const imageData = await this.mediaService.findImage(createFilenames);
    // 업로드 파일이 있으면 업로드 후 메타데이터 저장
    const filesData = await Promise.all(
      files.map(async (item) =>
        this.mediaService.uploadAttachment(item, "attachment"),
      ),
    );
    // 이미지, 첨부파일의 메타데이터와 포스트를 전부 각각의 테이블에 저장
    await this.postRepository.create(
      {
        ...createPostDto,
        userId: userId,
      },
      imageData,
      filesData,
    );
  }

  async findAll(
    category: string,
    page: number,
    take: number,
    language: Language,
  ) {
    const [posts, total] = await this.postRepository.getAllForCategory(
      category,
      page,
      take,
      language,
    );
    const totalPage = Math.ceil(total / take);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      data: posts,
      currentPage: page,
      prevPage,
      nextPage,
      totalPage,
    };
  }

  async findOneForId(id: number) {
    const post = await this.postRepository.getOneById(id);
    const attachments = await this.postRepository.getAttachmentsByPostId(id);
    if (!post) {
      return {
        post: null,
        files: [],
      };
    }

    return {
      post,
      files: attachments,
    };
  }

  async findOneForCategory(category: string, language: Language) {
    return await this.postRepository.getOneForCategory(category, language);
  }

  async findApplicant() {
    const regex: RegExp = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/;
    const applicants = await this.postRepository.getOneForCategory(
      "guidelinesForApplicants",
      Language.korean,
    );
    if (!applicants?.id) {
      throw new InternalServerErrorException("모집요강을 못 찾았습니다.");
    }
    const applicantFile = await this.postRepository.getAttachmentsByPostId(
      applicants.id,
    );
    const entry = await this.postRepository.getOneForCategory(
      "applicants",
      Language.korean,
    );
    if (!entry?.id) {
      throw new InternalServerErrorException("입학신청서를 못 찾았습니다.");
    }
    const entryFile = await this.postRepository.getAttachmentsByPostId(
      entry.id,
    );

    const applicantsMatch = regex.exec(applicants.content);
    const entryMatch = regex.exec(entry.content);
    if (!applicantsMatch || !entryMatch) {
      throw new NotFoundException(
        "입학신청서와 모집요강의 이미지를 가져오지 못했습니다.",
      );
    }
    return {
      applicants: {
        imageUrl: applicantsMatch[1].replace(
          `${process.env.BACKEND_URL}/files`,
          "",
        ),
        fileUrl: applicantFile[0].url,
      },
      entry: {
        imageUrl: entryMatch[1].replace(`${process.env.BACKEND_URL}/files`, ""),
        fileUrl: entryFile[0].url,
      },
    };
  }

  async findNews(language: Language) {
    const regex: RegExp = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/;
    const data = await this.postRepository.getNews(language);
    return data.map((item) => {
      const match = regex.exec(item.content);
      if (match) {
        return {
          postId: item.postId,
          title: item.title,
          imageUrl: match[1].replace(`${process.env.BACKEND_URL}/files`, ""),
        };
      }
    });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    files: Express.Multer.File[],
  ) {
    const { deleteFilePath, ...dto } = updatePostDto;

    const regex = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
    const imageInContent: string[] = [];
    let match: RegExpExecArray | null;
    while (
      updatePostDto.content &&
      (match = regex.exec(updatePostDto.content)) !== null
    ) {
      imageInContent.push(
        match[1].replace(`${process.env.BACKEND_URL}/files`, ""),
      );
    }

    const postImages = await this.postRepository.findImagesWithPostId(id);

    const oldImages = postImages.map((item) => item.filename);

    const newImages = imageInContent.filter(
      (item) => !oldImages.includes(item),
    );

    const deleteImages = oldImages.filter(
      (item) => !imageInContent.includes(item),
    );

    const imageData = await this.mediaService.findImage(newImages);
    // 업로드 파일이 있으면 업로드 후 메타데이터 저장
    const filesData = await Promise.all(
      files.map(async (item) =>
        this.mediaService.uploadAttachment(item, "attachment"),
      ),
    );

    const raw = JSON.parse(deleteFilePath) as string[];
    if (!Array.isArray(raw) || !raw.every((v) => typeof v === "string")) {
      throw new BadRequestException("deleteTarget는 문자열 배열이어야 합니다.");
    }

    await this.postRepository.update(
      id,
      dto,
      raw,
      imageData,
      filesData,
      deleteImages,
    );
  }

  async remove(id: number) {
    const result = await this.postRepository.delete(id);
    return result;
  }

  async search(
    target: searchTarget,
    word: string,
    language: Language,
    category: string,
    page: number,
    limit: number,
  ) {
    const [posts, total] = await this.postRepository.search(
      target,
      word,
      language,
      category,
      page,
      limit,
    );
    const totalPage = Math.ceil(total / limit);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      data: posts,
      currentPage: page,
      prevPage,
      nextPage,
      totalPage,
    };
  }
}
