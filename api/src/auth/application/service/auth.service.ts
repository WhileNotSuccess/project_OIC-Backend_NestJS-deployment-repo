import { BadRequestException, Injectable } from "@nestjs/common";
import { Users } from "src/users/domain/entities/users.entity";
import { UsersRepository } from "src/users/domain/repository/users.repository";
import { logInDto } from "../dto/logIn.dto";
import { SignInDto } from "../dto/signIn.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { CustomRequest } from "../guard/types/customRequest.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: SignInDto, googleId?: string) {
    let hashedPassword: string | undefined;
    if (createUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    }
    const createdUser = await this.userRepository.create(
      new Users(
        createUserDto.name,
        createUserDto.email,
        hashedPassword,
        googleId,
      ),
    );
    return createdUser;
  }
  async logInUser(logInDto: logInDto) {
    const userInfo = await this.userRepository.getOneByEmail(logInDto.email);
    if (!userInfo) return null;
    return await this.issuesJwt(userInfo);
  }
  async issuesJwt(user: Users) {
    const payload = {
      sub: `${user.id}`,
      username: user.name,
      email: user.email,
    };
    return { access_token: await this.jwtService.signAsync(payload) }; // 암호화 토큰 생성, 반환
  }
  async googleLink(jwtUser: CustomRequest["user"], googleUserId: string) {
    const check = await this.userRepository.getOneByGoogleId(googleUserId);

    if (check) {
      throw new BadRequestException("이미 가입되어있는 구글 계정입니다.");
    }
    const checkUser = await this.userRepository.getOneByEmail(jwtUser.email);
    if (!checkUser)
      throw new BadRequestException("가입되어있는 유저인지 확인해주십시오.");
    if (checkUser.googleId) {
      throw new BadRequestException("이미 연동이 되어있습니다.");
    }
    await this.userRepository.updateName(+jwtUser.sub, googleUserId);
    const token = await this.issuesJwt({ ...jwtUser, id: +jwtUser.sub });
    return token;
  }
}
