import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { TokenService } from "../services/token.service";
import { DataSource } from "typeorm";
import { transactional } from "src/common/utils/transaction-helper";

@Injectable()
export class LinkGoogleUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly dataSource: DataSource,
  ) {}
  async execute(jwtUser: Express.User, googleUser:string) {
    const userId = jwtUser.id;
    const googleId = googleUser;
    if (!userId || !googleId) throw new Error("정보가 잘못 되었습니다.");
    // googleId를 쓰는 유저가 있는가
    const check = await this.authRepository.findByGoogleId(googleId);
    if (check)
      throw new BadRequestException("이미 가입되어있는 구글 계정입니다.");
    // 이메일로 등록된 user를 찾고 토큰이 변질 됐는지 확인하기 위해 id 대조
    const userInfo = await this.userRepository.findByEmail(jwtUser.email);
    if (userInfo?.id !== userId)
      throw new BadRequestException("토큰 정보가 변질되었습니다.");
    // 여기서부터는 일반 회원가입만 되어있고 google연동은 안되있는 user
    const authInfo = await this.authRepository.findByUserId(userInfo.id);
    if (!authInfo) throw new Error("auth 정보가 등록되어 있지 않습니다.");
    authInfo?.linkGoogleId(googleId);

    await transactional(this.dataSource, async (queryRunner) => {
      await this.authRepository.save(queryRunner, authInfo);
    });

    const token = await this.tokenService.generateAccessToken(
      userId,
      jwtUser.name,
      jwtUser.email,
    );
    return token;
  }
}
