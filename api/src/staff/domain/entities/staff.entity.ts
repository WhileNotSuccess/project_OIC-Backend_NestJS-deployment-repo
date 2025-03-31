export class Staff {
  constructor(
    public name: string,
    public phoneNumber: string,
    public role: string,
    public id?: number,
  ) {}
  isAdmin() {
    return this.role === "admin";
  }
}
