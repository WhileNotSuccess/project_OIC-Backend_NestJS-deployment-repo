export class Auth {
  constructor(
    public readonly userId: number,
    public hashedPassword?: string,
    public googleId?: string,
  ) {}
  updatePassword(newHash: string) {
    this.hashedPassword = newHash;
  }
  linkGoogleId(linkGoogleId: string) {
    this.googleId = linkGoogleId;
  }
}
