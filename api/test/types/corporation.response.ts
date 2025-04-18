import { Corporation } from "src/corporation/domain/entities/corporation.entity";

export interface CorporationResponse {
  message: string;
  data: Corporation[];
}

export interface CorporationNamesResponse {
  message: string;
  data: string[];
}
