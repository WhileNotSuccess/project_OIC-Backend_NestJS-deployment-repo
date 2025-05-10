import { Module } from "@nestjs/common";
import { AuthController } from "./interface/controller/auth.controller";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { LoginWithGoogleUseCase } from "./application/use-cases/login-with-google.use-case";
import { TokenService } from "./application/services/token.service";
import { AuthRepository } from "./domain/repositories/user-credential.repository";
import { TypeormAuthRepository } from "./infra/repository/typeorm-auth.repository";
import { JwtStrategy } from "./infra/strategy/jwt.strategy";
import { GoogleStrategy } from "./infra/strategy/google.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/user.module";
import { PasswordService } from "./domain/services/password.service";
import { BcryptPasswordService } from "./infra/services/bcrypt-password.service";
import { LinkGoogleUseCase } from "./application/use-cases/link-google.use-case";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { CreateGoogleUserUseCase } from "./application/use-cases/create-user-google.use-case";
import { GoogleLinkStrategy } from "./infra/strategy/google-link.strategy";
import { AdminStrategy } from "./infra/strategy/admin.strategy";
import { CommonModule } from "src/common/common.module";
import { ChangePasswordUseCase } from "./application/use-cases/change-password.use-case";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          process.env.NODE_ENV === "test" ? "JWT_TEST_SECRET" : "JWT_SECRET",
        ),
        signOptions: { expiresIn: "1h" },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UserModule,
    CommonModule,
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [
    // 전략
    JwtStrategy,
    GoogleStrategy,
    GoogleLinkStrategy,
    AdminStrategy,
    // 로그인 use-case
    LoginUseCase,
    LoginWithGoogleUseCase,
    // 유저생성 use-case
    CreateUserUseCase,
    CreateGoogleUserUseCase,
    // 비밀번호 변경 use-case
    ChangePasswordUseCase,
    // 구글연동 use-case
    LinkGoogleUseCase,
    // 토큰발급 서비스
    TokenService,

    { provide: AuthRepository, useClass: TypeormAuthRepository },
    { provide: PasswordService, useClass: BcryptPasswordService },
  ],
})
export class AuthModule {}
