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
    const callbackURL = configService.get<string>("GOOGLE_CALLBACK_LINK_URL");
    if (!clientID || !clientSecret || !callbackURL)
      throw new Error("oauth관련 환경변수를 확인해 주십시오.");
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ["profile", "email"],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): string {
    return profile.id;
  }
}
