import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Req,
  DefaultValuePipe,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from "@nestjs/common";
import { PostService } from "../application/service/post.service";
import { CreatePostDto } from "../application/dto/create-post.dto";
import { UpdatePostDto } from "../application/dto/update-post.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { SearchTarget } from "../domain/types/search-target.enum";
import { RequestWithCookies } from "src/common/request-with-cookies";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Language } from "../../common/types/language";
import { toLanguageEnum } from "src/common/utils/to-language-enum";
import { SearchPostQueryDto } from "./dto/search-post-query.dto";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { CustomRequest } from "src/common/types/custom-request";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: "에디터에서 사용할 이미지 업로드 api" })
  @ApiResponse({
    example: {
      message: "이미지 업로드에 성공했습니다.",
      url: "/image/hello.png",
    },
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
          description: "이미지 파일",
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor("image"))
  @UseGuards(AuthGuard)
  @Post("image")
  async uploadImage(
    @UploadedFiles() image: Express.Multer.File[],
    // @Req() req: RequestWithCookies,
  ) {
    const url = await this.postService.uploadImage(image[0]);
    return {
      message: "이미지 업로드에 성공했습니다.",
      url,
    };
  }

  @ApiOperation({
    summary:
      "메인에서 사용, 모집요강 파일 이름과 사진, 입학신청서 파일 이름과 사진을 받아 올 수 있다.",
  })
  @ApiResponse({
    example: {
      message: "모집요강과 입학신청서를 불러왔습니다.",
      applicants: {
        imageUrl: "string",
        fileUrl: "string",
      },
      entry: {
        imageUrl: "string",
        fileUrl: "string",
      },
    },
  })
  @Get("main/applicants")
  async getApplicants() {
    const applicants = await this.postService.findApplicant();
    return {
      message: "모집요강과 입학신청서를 불러왔습니다.",
      applicants: applicants.applicants,
      entry: applicants.entry,
    };
  }

  @ApiOperation({
    summary: "검색하기, 제목/내용/작성자 중 하나를 검색할 수 있다.",
  })
  @ApiQuery({
    name: "category",
    example: "notice",
    description: "카테고리, 모든 카테고리에서 검색하는 기능은 지원하지 않음",
    required: false,
  })
  @ApiQuery({
    name: "target",
    enum: SearchTarget,
    description: "검색대상 title, author, date 중 하나",
    required: false,
  })
  @ApiQuery({
    name: "word",
    example: "hello",
    description: "검색하고 싶은 단어",
    required: false,
  })
  @ApiQuery({
    name: "limit",
    example: 10,
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: "page",
    example: 1,
    required: false,
    default: 1,
  })
  @ApiResponse({
    example: {
      message: "검색결과를 불러왔습니다.",
      data: [
        {
          title: "title",
          content: "content",
          userId: 1,
          category: "category",
          language: "language",
          createdDate: "createdDate",
          updatedDate: "updatedDate",
          id: 1,
        },
      ],
      currentPage: 2,
      prevPage: 1,
      nextPage: 3,
      totalPage: 10,
    },
  })
  @Get("search")
  async search(
    @Req() req: RequestWithCookies,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("category") category: string,
    @Query() query: SearchPostQueryDto,
  ) {
    const { target, word } = query;
    const rawLang = req.cookies["language"] || "korean";
    const language: Language = toLanguageEnum(rawLang);

    const result = await this.postService.search(
      target,
      word,
      language,
      category,
      +page,
      +limit,
    );
    return {
      message: "검색결과를 불러왔습니다.",
      ...result,
    };
  }

  @ApiOperation({ summary: "메인화면 카드 슬라이드" })
  @ApiResponse({
    example: {
      message: "알림을 성공적으로 가져왔습니다.",
      data: [
        {
          postId: 1,
          imageUrl: "https://example.com/api/files/hello.png",
          title: "게시글 제목",
        },
      ],
    },
  })
  @Get("main/news")
  async getNews(@Req() req: RequestWithCookies) {
    const rawLang = req.cookies["language"] || "korean";
    const language: Language = toLanguageEnum(rawLang);

    const result = await this.postService.findNews(language);
    return {
      message: "알림을 성공적으로 가져왔습니다.",
      data: result,
    };
  }

  @ApiOperation({ summary: "메인화면 공지 슬라이드" })
  @ApiResponse({
    example: {
      message: "공지를 성공적으로 가져왔습니다.",
      data: [
        {
          postId: 1,
          content:
            "2025년 상반기 은평구민 장학생을 다음과 같이 모집하오니 해당 학생은 많은 신청바랍니다.",
          title: "게시글 제목",
          date: "2025-04-22T11:34:06.175Z",
        },
      ],
    },
  })
  @Get("main/notices")
  async getNotices(@Req() req: RequestWithCookies) {
    const rawLang = req.cookies["language"] || "korean";
    const language: Language = toLanguageEnum(rawLang);

    const result = await this.postService.findNotice(language);
    return {
      message: "공지를 성공적으로 가져왔습니다.",
      data: result,
    };
  }

  @ApiOperation({ summary: "post 작성하기" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "string",
          format: "binary",
          description: "글의 첨부파일 전부, 없을 경우 필수 아님",
        },
        category: { type: "string", description: "글의 카테고리, 필수" },
        title: { type: "string", description: "글의 제목, 필수" },
        content: { type: "string", description: "글의 내용, 필수" },
        language: { type: "string", description: "글의 언어, 필수" },
      },
    },
  })
  @ApiResponse({
    example: { message: "게시글이 작성되었습니다." },
  })
  @UseInterceptors(FilesInterceptor("files", 10))
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: CustomRequest,
  ) {
    await this.postService.create(createPostDto, req.user.id, files);
    return {
      message: "게시글이 작성되었습니다.",
    };
  }

  @ApiOperation({ summary: "해당 카테고리의 모든 post 가져오기" })
  @ApiParam({
    name: "category",
    example: "notice",
  })
  @ApiQuery({
    name: "limit",
    example: 10,
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: "page",
    example: 1,
    required: false,
    default: 1,
  })
  @ApiResponse({
    example: {
      message: "게시글 목록을 불러왔습니다.",
      data: [
        {
          id: 1,
          title: "asdf",
          content: "<p>asdf</p>",
          author: "admin",
          category: "notice",
          createdDate: "2025-01-31T15:12:47.145Z",
          updatedDate: "2025-01-31T15:12:58.281Z",
          language: "korean",
        },
      ],
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPage: 1,
    },
  })
  @Get(":category")
  async findAll(
    @Param("category") category: string,
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Req() req: RequestWithCookies,
  ) {
    const rawLang = req.cookies["language"] || "korean";
    const language: Language = toLanguageEnum(rawLang);

    const result = await this.postService.findAll(
      category,
      page,
      limit,
      language,
    );
    return {
      message: "게시글 목록을 불러왔습니다.",
      ...result,
    };
  }

  @ApiOperation({ summary: "하나의 post를 id로 가져오기" })
  @ApiParam({
    name: "id",
    example: 1,
    description: "게시글의 아이디",
  })
  @ApiResponse({
    example: {
      message: "1번 게시글을 불러왔습니다.",
      data: {
        id: 1,
        title: "asdf",
        content: "<p>asdf</p>",
        author: "admin",
        userId: 1,
        category: "notice",
        createdDate: "2025-01-31T15:12:47.145Z",
        updatedDate: "2025-01-31T15:12:58.281Z",
        language: "korean",
      },
      files: [
        {
          id: 1,
          postId: 1,
          filename: "20250204-154557_인천대학교 한국어 교육센터 메뉴 구성.hwp",
          fileType: "application/octet-stream",
          fileSize: 20234,
        },
      ],
    },
  })
  @Get("one/id/:id")
  async findOneForId(@Param("id") id: string) {
    const { post, files } = await this.postService.findOneForId(+id);
    if (!post) {
      throw new NotFoundException("해당 포스트가 없습니다.");
    }

    return {
      message: `${id}번 게시글을 불러왔습니다.`,
      data: post,
      files: files,
    };
  }

  @ApiOperation({ summary: "하나의 post를 category로 가져오기" })
  @ApiParam({
    name: "category로",
    example: "notice",
    description: "게시글 카테고리",
  })
  @ApiResponse({
    example: {
      message: "notice의 게시글을 불러왔습니다.",
      data: {
        id: 1,
        title: "asdf",
        content: "<p>asdf</p>",
        author: "admin",
        userId: 1,
        category: "notice",
        createdDate: "2025-01-31T15:12:47.145Z",
        updatedDate: "2025-01-31T15:12:58.281Z",
        language: "korean",
      },
    },
  })
  @Get("one/category/:category")
  async findOneForCategory(
    @Param("category") category: string,
    @Req() req: RequestWithCookies,
  ) {
    const rawLang = req.cookies["language"] || "korean";
    const language: Language = toLanguageEnum(rawLang);

    const post = await this.postService.findOneForCategory(category, language);
    if (!post) {
      throw new NotFoundException("해당 포스트가 없습니다.");
    }
    return {
      message: `${category}의 게시글을 불러왔습니다.`,
      data: post,
    };
  }

  @ApiOperation({ summary: "post 수정하기" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "string",
          format: "binary",
          description: "글의 첨부파일 전부, 없을 경우 필수 아님",
        },
        category: { type: "string", description: "글의 카테고리, 필수" },
        title: { type: "string", description: "글의 제목, 필수" },
        content: { type: "string", description: "글의 내용, 필수" },
        language: { type: "string", description: "글의 언어, 필수" },
        deleteFilePath: {
          type: "string",
          description:
            "기존 파일 중 삭제할 파일의 url들을 전부 배열에 넣어서 JSON.stringify()로 바꾼 결과물, 삭제할 첨부파일이 없는 경우 필수 아님",
        },
      },
    },
  })
  @ApiResponse({
    example: { message: "수정이 완료되었습니다." },
  })
  @UseInterceptors(FilesInterceptor("files", 10))
  @UseGuards(AuthGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: CustomRequest,
  ) {
    await this.postService.checkPostOwner(+id, req.user.id, req.user.email);
    await this.postService.update(+id, updatePostDto, files);
    return {
      message: "수정이 완료되었습니다.",
    };
  }

  @ApiOperation({ summary: "post 삭제하기" })
  @ApiParam({ name: "id", example: 1 })
  @ApiResponse({ example: { message: "삭제가 완료되었습니다." } })
  @Delete(":id")
  @UseGuards(AuthGuard)
  async remove(@Param("id") id: string, @Req() req: CustomRequest) {
    await this.postService.checkPostOwner(+id, req.user.id, req.user.email);
    const result = await this.postService.remove(+id);
    if (!result) {
      throw new NotFoundException("해당 포스트가 없습니다.");
    }
    return {
      message: "삭제가 완료되었습니다.",
    };
  }
}
