export class User {
  constructor(
    public name: string,
    public email: string,
    public readonly id?: string,
    public readonly createDate?: Date,
  ) {}
  static create(name: string, email: string): User {
    return new User(name, email);
  }
}
