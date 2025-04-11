export class PrideOfYju {
  constructor(
    public image: string,
    public Korean: string,
    public English: string,
    public Japanese: string,
    public id?: number,
  ) {}

  isImage() {
    return this.image === "/1234-image.jpg";
  }
}
