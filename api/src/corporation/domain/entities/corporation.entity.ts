export class Corporation {
  constructor(
    public koreanName: string,
    public englishName: string,
    public corporationType: string,
    public countryId: number,
    public id?: number,
  ) {}
}
