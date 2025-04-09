import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";

@Injectable()
export class GoogleLinkStrategy extends PassportStrategy(
  Strategy,
  "googleLink",
) {
  constructor(private readonly configService: ConfigService) {
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

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile.id; // google 유저 고유 Id
  }
}
