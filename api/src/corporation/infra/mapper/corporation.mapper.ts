import { Corporation } from "src/corporation/domain/entities/corporation.entity";
import { CorporationOrmEntity } from "../entities/corporation.entity";
import { CountryOrmEntity } from "../entities/country.entity";
import { Country } from "src/corporation/domain/entities/country.entity";

export const toDomainCorporation = (
  corporationOrmEntity: CorporationOrmEntity,
) => {
  const domain = new Corporation(
    corporationOrmEntity.koreanName,
    corporationOrmEntity.englishName,
    corporationOrmEntity.corporationType,
    corporationOrmEntity.countryId,
    corporationOrmEntity.id,
  );
  return domain;
};
export const toDomainCountry = (countryOrmEntity: CountryOrmEntity) => {
  const domain = new Country(
    countryOrmEntity.name,
    countryOrmEntity.englishName,
    countryOrmEntity.japaneseName,
    countryOrmEntity.x,
    countryOrmEntity.y,
    countryOrmEntity.id,
  );
  return domain;
};
