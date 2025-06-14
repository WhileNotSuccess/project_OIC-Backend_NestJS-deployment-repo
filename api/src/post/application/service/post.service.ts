import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreatePostDto } from "../dto/create-post.dto";
import { UpdatePostDto } from "../dto/update-post.dto";
import { PostRepository } from "src/post/domain/repository/post.repository";
import { SearchTarget } from "src/post/domain/types/search-target.enum";
import { Language } from "src/common/types/language";
import { MediaServicePort } from "src/media/application/media-service.port";
import { HtmlParserPort } from "../port/html-parser.port";
import { PostQueryRepository } from "../query/post-query.repository";
import { NewNewsEventBand } from "src/post/domain/events/new-news-band.event";
import { NewNewsEventX } from "src/post/domain/events/new-news-X.event";
import { EventBus } from "@nestjs/cqrs";

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly MediaServicePort: MediaServicePort,
    private readonly htmlParser: HtmlParserPort,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async checkPostOwner(
    postId: number,
    userId: number,
    email: string,
  ): Promise<boolean> {
    if (email === process.env.ADMIN_EMAIL) {
      return true;
    }
    const post = await this.postQueryRepository.getOneWithAuthorById(postId);
    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다.");
    }
    return post.userId === userId;
  }

  async uploadImage(image: Express.Multer.File) {
    const url = await this.MediaServicePort.uploadImage(image, "post-image");
    return url;
  }

  async create(
    createPostDto: CreatePostDto,
    userId: number,
    files: Express.Multer.File[],
  ) {
    // 이미지 추출
    const regex =
      /<img[^>]+src=["']?([^"'>]+(?:\.png|\.jpg|\.jpeg|\.gif|\.webp))["']?/gi;

    const createFilenames: string[] = [];
    let match: RegExpExecArray | null;
    if ((match = regex.exec(createPostDto.content)) !== null) {
      createFilenames.push(
        match[1].replace(`${process.env.BACKEND_URL}/files`, ""),
      );
    }
    // 서버에 저장된 이미지 정보 찾기
    const imageData = await this.MediaServicePort.findImage(createFilenames);
    // 업로드 파일이 있으면 업로드 후 메타데이터 저장
    const filesData = await Promise.all(
      files.map(async (item) =>
        this.MediaServicePort.uploadAttachment(item, "attachment"),
      ),
    );
    // 이미지, 첨부파일의 메타데이터와 포스트를 전부 각각의 테이블에 저장
    const result = await this.postRepository.create(
      {
        ...createPostDto,
        userId: userId,
      },
      imageData,
      filesData,
    );

    // 게시글 생성 후 이벤트 발생
    if (
      process.env.NODE_ENV !== "test" &&
      result.category === "news" &&
      result.id
    ) {
      this.eventBus.publish(
        new NewNewsEventBand(createPostDto.title, result.id),
      );
      this.eventBus.publish(
        imageData.length > 0
          ? new NewNewsEventX(
              createPostDto.title,
              result.id,
              // /files/~~.jpg 형식의 files 하워 폴터부터 시작하는 경로
              imageData[0].filename,
            )
          : new NewNewsEventX(createPostDto.title, result.id),
      );
    }
  }

  async findAll(
    category: string,
    page: number,
    take: number,
    language: Language,
  ) {
    // 페이지네이션 정보 불러오기
    const [posts, total] =
      await this.postQueryRepository.getManyWithAuthorByCategory(
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

  async findAllWithoutLanguage(category: string, page: number, take: number) {
    // 페이지네이션 정보 불러오기
    const [posts, total] =
      await this.postQueryRepository.getManyWithAuthorByCategoryWithoutLanguage(
        category,
        page,
        take,
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
    // 게시글 받아오기
    const post = await this.postQueryRepository.getOneWithAuthorById(id);
    // 첨부파일 확인
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

    // 모집요강 게시글 불러오기
    const applicants = await this.postRepository.getOneForCategory(
      "guidelinesForApplicants",
      Language.korean,
    );
    if (!applicants?.id) {
      throw new InternalServerErrorException("모집요강을 못 찾았습니다.");
    }

    // 모집요강 파일 불러오기
    const applicantFile = await this.postRepository.getAttachmentsByPostId(
      applicants.id,
    );

    // 입학신청서 게시글 불러오기
    const entry = await this.postRepository.getOneForCategory(
      "applicants",
      Language.korean,
    );
    if (!entry?.id) {
      throw new InternalServerErrorException("입학신청서를 못 찾았습니다.");
    }

    // 입학신청서 파일 불러오기
    const entryFile = await this.postRepository.getAttachmentsByPostId(
      entry.id,
    );

    // 썸네일 추출
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
    // post 정보 불러오기
    const data = await this.postRepository.getNews(language);
    return data.map((item) => {
      const match = regex.exec(item.content);
      if (match) {
        return {
          postId: item.postId,
          title: item.title,
          imageUrl: match[1].replace(`${process.env.BACKEND_URL}/files`, ""),
          date: item.date,
        };
      }
    });
  }

  async findNotice(language: Language) {
    const [data] = await this.postQueryRepository.getManyWithAuthorByCategory(
      "notice",
      1,
      10,
      language,
    );

    const resultReturn = data.map((item) => {
      const html = item.content;

      // jsdom을 사용하여 HTML 파싱
      const preview = this.htmlParser.extractFirstParagraphText(html);

      return {
        postId: item.id,
        title: item.title,
        date: item.createdDate,
        content: preview,
      };
    });

    return resultReturn;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    files: Express.Multer.File[],
  ) {
    // deleteFilePath 분리
    const { deleteFilePath, ...dto } = updatePostDto;

    const regex =
      /<img[^>]+src=["']?([^"'>]+(?:\.png|\.jpg|\.jpeg|\.gif|\.webp))["']?/gi;

    // 업데이트 할 글에 들어있는 image의 src 추출
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

    // 기존에 저장된 이미지 확인
    const postImages = await this.postRepository.findImagesWithPostId(id);
    const oldImages = postImages.map((item) => item.filename);

    // 기존 글엔 없지만 새로운 글엔 있는 이미지 찾기
    const newImages = imageInContent.filter(
      (item) => !oldImages.includes(item),
    );

    // 새로운 글에 없지만 기존 글에 있던 이미지 찾기
    const deleteImages = oldImages.filter(
      (item) => !imageInContent.includes(item),
    );

    // 새로 저장해야할 이미지의 파일 정보 찾기
    const imageData = await this.MediaServicePort.findImage(newImages);
    // 업로드 파일이 있으면 업로드 후 메타데이터 저장
    const filesData = await Promise.all(
      files.map(async (item) =>
        this.MediaServicePort.uploadAttachment(item, "attachment"),
      ),
    );

    let raw: string[] = [];
    // deleteFilePath를 배열로 변환
    if (deleteFilePath) {
      raw = JSON.parse(deleteFilePath) as string[];
      if (!Array.isArray(raw) || !raw.every((v) => typeof v === "string")) {
        throw new BadRequestException(
          "deleteTarget는 문자열 배열이어야 합니다.",
        );
      }
    }

    // 업데이트
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
    target: SearchTarget,
    word: string,
    language: Language,
    category: string,
    page: number,
    limit: number,
  ) {
    const [posts, total] = await this.postQueryRepository.search(
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
