import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { Users } from "src/users/domain/entities/users.entity";
import { UsersRepository } from "src/users/domain/repository/users.repository";

interface googleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = configService.get<string>("GOOGLE_SECRET");
    const callbackURL = configService.get<string>("GOOGLE_CALLBACK_URL");
    // string 타입일수도 undefined일수도 있어서 undefined일 경우엔 에러로 보냄
    if (!clientID || !clientSecret || !callbackURL)
      throw new Error("Check the Google OAuth enviroment variables");
    super({
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
  ): Promise<null | object | googleUser> {
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : null;

    if (!email) return null;

    const user: null | Users = await this.userRepository.getOneByEmail(email);
    let returnUser: object | null = null;
    if (!user) {
      const exist = await this.userRepository.getOneByGoogleId(profile.id);
      if (exist) {
        return null;
      }
      // const date = new Date();
      const newUser = await this.userRepository.create({
        name: profile.displayName,
        email,
        // emailVerifiedAt: profile.emails[0].verified ? date : null,
        googleId: profile.id,
      });
      returnUser = { ...newUser, newUser: true };
    }
    return returnUser;
  }
}
