import { Auth } from "../entities/auth.entity";

// UserCredential을 db에 저장하는 레포지토리
export abstract class AuthRepository {
  abstract save(queryRunner, credential: Auth): Promise<boolean>;
  abstract findByUserId(userId: number): Promise<Auth | null>;
  abstract findByGoogleId(googleId: string): Promise<Auth | null>;
}
