import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { PostService } from "../application/service/post.service";
import { CreatePostDto } from "../application/dto/create-post.dto";
import { UpdatePostDto } from "../application/dto/update-post.dto";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    await this.postService.create(createPostDto);
    return {
      message: "게시글이 작성되었습니다.",
    };
  }

  @Get()
  async findAll() {
    return {
      message: "게시글 목록을 불러왔습니다.",
      data: await this.postService.findAll(),
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const post = await this.postService.findOne(+id);
    if (!post) {
      throw new NotFoundException("해당 포스트가 없습니다.");
    }
    return {
      message: `${id}번 게시글을 불러왔습니다.`,
      data: post,
    };
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    await this.postService.update(+id, updatePostDto);
    return {
      message: "수정이 완료되었습니다.",
    };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const result = await this.postService.remove(+id);
    if (!result) {
      throw new NotFoundException("해당 포스트가 없습니다.");
    }
    return {
      message: "삭제가 완료되었습니다.",
    };
  }
}
