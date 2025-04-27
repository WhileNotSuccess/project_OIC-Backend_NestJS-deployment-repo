export class User {
  constructor(
    public name: string,
    public email: string,
    public readonly id?: number,
    public readonly createDate: Date = new Date(),
  ) {}
  static create(name: string, email: string): User {
    return new User(name, email);
  }
}
