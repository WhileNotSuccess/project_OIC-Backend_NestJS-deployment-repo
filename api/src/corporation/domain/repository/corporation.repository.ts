import { Corporation } from "../entities/corporation.entity";
import { Country } from "../entities/country.entity";

export abstract class CorporationRepository {
  abstract createCorporation(dto: Partial<Corporation>): Promise<Corporation>;
  abstract updateCorporation(
    dto: Partial<Corporation>,
    id: number,
  ): Promise<Corporation>;
  abstract deleteCorporation(id: number): Promise<boolean>;
  abstract createCountry(dto: Partial<Country>): Promise<Country>;
  abstract updateCountry(dto: Partial<Country>, id: number): Promise<Country>;
  abstract deleteCountry(id: number): Promise<boolean>;
  abstract getCorporationByCountryId(countryId: number): Promise<Corporation[]>;
  abstract getAllCorporation(): Promise<Corporation[]>;
  abstract getAllCountry(): Promise<Country[]>;
}
