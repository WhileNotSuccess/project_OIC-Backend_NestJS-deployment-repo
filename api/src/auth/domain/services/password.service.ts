// 비밀번호 암호화 및 평문 비밀번호와 암호화된 비밀번호를 비교하는 서비스
export abstract class PasswordService {
  abstract hash(password: string): Promise<string>;
  abstract compare(plane: string, hashedPassword: string): Promise<boolean>;
}
