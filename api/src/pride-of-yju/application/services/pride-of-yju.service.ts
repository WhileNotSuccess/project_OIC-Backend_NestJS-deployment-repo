import { Injectable } from "@nestjs/common";
import { PrideOfYjuRepository } from "../../domain/repository/pride-of-yju.repository";
import { CreatePrideOfYjuDto } from "../dto/create-pride-of-yju.dto";
import { PrideOfYju } from "src/pride-of-yju/domain/entities/pride-of-yju.entity";
import { UpdatePrideOfYjuDto } from "../dto/update-pride-of-yju.dto";

@Injectable()
export class PrideOfYjuService {
  constructor(private readonly POYRepository: PrideOfYjuRepository) {}

  async create(image: string, dto: CreatePrideOfYjuDto) {
    const completedDto = new PrideOfYju(
      image,
      dto.Korean,
      dto.English,
      dto.Japanese,
    );
    const result = await this.POYRepository.create(completedDto);
    return !!result;
  }
  async update(id: number, image?: string, dto?: UpdatePrideOfYjuDto) {
    const completedDto = {
      image,
      ...dto,
    };
    const result = await this.POYRepository.update(id, completedDto);
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
    return result;
  }
}
