interface PrideOfYju {
  id: number;
  image: string;
  korean: number;
  english: number;
  japanese: number;
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
