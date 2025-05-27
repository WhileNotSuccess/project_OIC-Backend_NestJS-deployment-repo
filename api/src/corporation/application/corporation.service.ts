import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCorporationDto } from "./dto/create-corporation.dto";
import { UpdateCorporationDto } from "./dto/update-corporation.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { CreateCountryDto } from "./dto/create-county.dto";
import { CorporationRepository } from "../domain/repository/corporation.repository";
import { Language } from "src/common/types/language";
import { Country } from "../domain/entities/country.entity";

@Injectable()
export class CorporationService {
  constructor(private readonly repository: CorporationRepository) {}
  async countCorporationAndCountry() {
    const [corporationCount, countryCount] = await Promise.all([
      this.repository.countCorporation(),
      this.repository.countCountry(),
    ]);
    return [corporationCount, countryCount];
  }
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

  async getCorporationByCountry(language: Language, country: string) {
    const countries = await this.repository.getAllCountry();

    let target: Country[];
    if (language === Language.english) {
      target = countries.filter((item) => item.englishName === country);
    } else if (language === Language.japanese) {
      target = countries.filter((item) => item.japaneseName === country);
    } else {
      target = countries.filter((item) => item.name === country);
    }

    const countryId = target[0].id;

    if (!countryId) {
      throw new InternalServerErrorException(
        "getCorporationByCountry 메소드에서 에러",
      );
    }
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
