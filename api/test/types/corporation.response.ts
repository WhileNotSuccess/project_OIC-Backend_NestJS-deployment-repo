import { Corporation } from "src/corporation/domain/entities/corporation.entity";

export interface CorporationResponse {
  message: string;
  data: Corporation[];
}

export interface CountryNamesResponse {
  message: string;
  data: Country[];
}
interface Country {
  id: number;
  name: string;
  x: number;
  y: number;
}

export interface MessageResponse {
  message: string;
}
