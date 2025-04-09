import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./interface/controller/auth.controller";
import { AuthService } from "./application/service/auth.service";
import { JwtStrategy } from "./application/stragies/jwt.strategy";
import { GoogleStrategy } from "./application/stragies/google.strategy";
import { GoogleLinkStrategy } from "./application/stragies/google-link.strategy";
import { AdminStrategy } from "./application/stragies/admin.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GoogleLinkStrategy,
    AdminStrategy,
  ],
})
export class AuthModule {}
