import { BadRequestException, Injectable } from "@nestjs/common";
import { PrideOfYjuRepository } from "../../domain/repository/pride-of-yju.repository";
import { CreatePrideOfYjuDto } from "../dto/create-pride-of-yju.dto";
import { PrideOfYju } from "src/pride-of-yju/domain/entities/pride-of-yju.entity";
import { UpdatePrideOfYjuDto } from "../dto/update-pride-of-yju.dto";
import { MediaService } from "src/media/domain/media.service";

@Injectable()
export class PrideOfYjuService {
  constructor(
    private readonly POYRepository: PrideOfYjuRepository,
    private readonly mediaService: MediaService,
  ) {}

  async create(file: Express.Multer.File, dto: CreatePrideOfYjuDto) {
    const imagePath = await this.mediaService.uploadImage(file, "pride");
    const completedDto = new PrideOfYju(
      imagePath,
      dto.Korean,
      dto.English,
      dto.Japanese,
    );
    const result = await this.POYRepository.create(completedDto);
    return !!result;
  }
  async update(
    id: number,
    file: Express.Multer.File,
    dto: UpdatePrideOfYjuDto,
  ) {
    let imagePath: string | undefined = undefined;
    if (file) imagePath = await this.mediaService.uploadImage(file, "pride");

    const result = await this.POYRepository.update(id, {
      ...dto,
      image: imagePath,
    });
    return !!result;
  }
  async delete(id: number) {
    const result = await this.POYRepository.delete(id);
    return result;
  }
  async getAll() {
    const result = await this.POYRepository.getAll();
    return result;
  }
  async getOne(id: number) {
    const result = await this.POYRepository.getOne(id);
    if (!result)
      throw new BadRequestException("해당 pride of yju는 존재하지 않습니다.");
    return result;
  }
}
