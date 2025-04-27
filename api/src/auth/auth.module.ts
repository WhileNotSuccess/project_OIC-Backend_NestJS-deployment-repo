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
import { AdminGuard } from "./infra/guards/admin.guard";
import { AuthGuard } from "./infra/guards/auth.guard";
import { GoogleAuthGuard } from "./infra/guards/google.guard";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/user.module";
import { PasswordService } from "./domain/services/password.service";
import { BcryptPasswordService } from "./infra/services/bcrypt-password.service";
import { LinkGoogleUseCase } from "./application/use-cases/link-google.use-case";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { CreateGoogleUserUseCase } from "./application/use-cases/create-user-google.use-case";
import { GoogleLinkStrategy } from "./infra/strategy/google-link.strategy";
import { GoogleLinkAuthGuard } from "./infra/guards/google-link.guard";
import { JwtLinkGuard } from "./infra/guards/jwt-link.guard";
import { AdminStrategy } from "./infra/strategy/admin.strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UserModule,
  ],
  exports: [JwtModule, AuthGuard, GoogleAuthGuard, AdminGuard],
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
    // 구글연동 use-case
    LinkGoogleUseCase,
    // 토큰발급 서비스
    TokenService,
    // 가드
    AuthGuard,
    GoogleAuthGuard,
    GoogleLinkAuthGuard,
    JwtLinkGuard,
    AdminGuard,

    { provide: AuthRepository, useClass: TypeormAuthRepository },
    { provide: PasswordService, useClass: BcryptPasswordService },
  ],
})
export class AuthModule {}
