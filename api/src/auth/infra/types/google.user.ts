export interface googleUser {
  name: string;
  email: string;
  // emailVerifiedAt: Date;
  // signUpVerifyToken: string;
  // password: string | null;
  sub: string;
  id?: number;
  newUser?: boolean;
  // emailExistsButGoogleIdIsNotExists?: string;
}
