import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCorporationDto } from "./dto/create-corporation.dto";
import { UpdateCorporationDto } from "./dto/update-corporation.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { CreateCountryDto } from "./dto/create-county.dto";
import { CorporationRepository } from "../domain/repository/corporation.repository";
import { Language } from "src/common/types/language";

@Injectable()
export class CorporationService {
  constructor(private readonly repository: CorporationRepository) {}
  async createCorporation(createCorporationDto: CreateCorporationDto) {
    return await this.repository.createCorporation(createCorporationDto);
  }
  async createCountry(createCountryDto: CreateCountryDto) {
    return await this.repository.createCountry(createCountryDto);
  }

  async updateCorporation(
    id: number,
    updateCorporationDto: UpdateCorporationDto,
  ) {
    return await this.repository.updateCorporation(updateCorporationDto, id);
  }
  async updateCountry(id: number, updateCountryDto: UpdateCountryDto) {
    return await this.repository.updateCountry(updateCountryDto, id);
  }

  async deleteCorporation(id: number) {
    return await this.repository.deleteCorporation(id);
  }
  async deleteCountry(id: number) {
    return await this.repository.deleteCountry(id);
  }

  async getAllCountry(language: Language) {
    const countries = await this.repository.getAllCountry();
    const result = countries.map((item) => {
      if (!item.id) {
        throw new InternalServerErrorException("getAllCountry 메소드에서 에러");
      }
      if (language == Language.english) {
        return {
          id: item.id,
          name: item.englishName,
          x: item.x,
          y: item.y,
        };
      } else if (language == Language.japanese) {
        return {
          id: item.id,
          name: item.japaneseName,
          x: item.x,
          y: item.y,
        };
      } else {
        return {
          id: item.id,
          name: item.name,
          x: item.x,
          y: item.y,
        };
      }
    });
    return result;
  }

  async getCorporationByCountry(language: Language, countryId: number) {
    const corporation =
      await this.repository.getCorporationByCountryId(countryId);
    const result = corporation.map((item) => {
      if (!item.id) {
        throw new InternalServerErrorException(
          "getCorporationByCountry 메소드에서 에러",
        );
      }
      if (language === Language.korean) {
        return {
          id: item.id,
          corporationType: item.corporationType,
          name: item.koreanName,
        };
      } else {
        return {
          id: item.id,
          corporationType: item.corporationType,
          name: item.englishName,
        };
      }
    });
    return result;
  }
}
