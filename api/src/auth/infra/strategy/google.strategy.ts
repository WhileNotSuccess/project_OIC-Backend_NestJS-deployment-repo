import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { Auth } from "src/auth/domain/entities/auth.entity";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { UserRepository } from "src/users/domain/repositories/user.repository";

export interface googleUser {
  name: string;
  email: string;
  newUser: boolean;
}
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = configService.get<string>("GOOGLE_SECRET");
    const callbackURL = configService.get<string>("GOOGLE_CALLBACK_LINK_URL");
    if (!clientID || !clientSecret || !callbackURL)
      throw new Error("oauth관련 환경변수를 확인해 주십시오.");
    super({
      // clientID: process.env.GOOGLE_CLIENT_ID,
      // clientSecret: process.env.GOOGLE_SECRET,
      // callbackURL: process.env.GOOGLE_CALLBACK_LINK_URL,
      clientID,
      clientSecret,
      callbackURL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<googleUser> {
    // googleId로 찾고, 있으면 oauth로 받은 데이터를 반환
    const user = await this.authRepository.findByGoogleId(profile.id);
    const userEmail = profile.emails;
    if (!userEmail) {
      throw new Error("로그인 불가능");
    }
    if (user)
      return {
        name: profile.displayName,
        email: userEmail[0].value,
        newUser: false,
      };
    // user가 없다면 해당 googleId로 등록한 사용자가 없음
    const emailArray = profile.emails;
    if (!emailArray) {
      throw new Error("로그인 불가능");
    }
    const UserEmail = emailArray[0].value;
    //google 이메일로 등록한 사용자가 있는지 확인
    const existUser = await this.userRepository.findByEmail(UserEmail);
    if (existUser) throw new Error("해당 이메일을 사용하는 유저가 있습니다.");
    // 유저 정보 등록
    const newUser = await this.userRepository.save({
      name: profile.displayName,
      email: UserEmail,
    });
    // 유저 auth에 googleId 등록
    if (!newUser.id) throw Error("");
    const auth = new Auth(newUser.id, undefined, profile.id);
    await this.authRepository.save(auth);
    const googleUser = { ...newUser, newUser: true };

    return googleUser;
  }
}
