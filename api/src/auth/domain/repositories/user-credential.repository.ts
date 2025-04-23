import { Auth } from "../entities/auth.entity";

// UserCredential을 db에 저장하는 레포지토리
export abstract class AuthRepository {
  abstract save(credential: Auth): Promise<boolean>;
  abstract findByUserId(userId: string): Promise<Auth | null>;
  abstract findByGoogleId(googleId: string): Promise<Auth | null>;
}
