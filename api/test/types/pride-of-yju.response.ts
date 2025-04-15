interface PrideOfYju {
  id: number;
  image: string;
  Korean: number;
  English: number;
  Japanese: number;
}
export interface PrideOfYjuResponse {
  message: string;
  data: PrideOfYju;
}
export interface PrideOfYjuOKResponse {
  message: string;
}
export interface PrideOfYjuArrayResponse {
  message: string;
  data: PrideOfYju[];
}
