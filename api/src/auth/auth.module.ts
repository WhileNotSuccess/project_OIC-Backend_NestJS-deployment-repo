import { Module } from "@nestjs/common";
import { AuthController } from "./interface/controller/auth.controller";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { LoginWithGoogleUseCase } from "./application/use-cases/login-with-google.use-case";
import { RegisterCredentialUseCase } from "./application/use-cases/register-credential.use-case";
import { TokenService } from "./application/services/token.service";
import { AuthRepository } from "./domain/repositories/user-credential.repository";
import { TypeormAuthRepository } from "./infra/repository/typeorm-auth.repository";
import { JwtStrategy } from "./infra/strategy/jwt.strategy";
import { GoogleStrategy } from "./infra/strategy/google.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    LoginUseCase,
    LoginWithGoogleUseCase,
    RegisterCredentialUseCase,
    TokenService,
    { provide: AuthRepository, useClass: TypeormAuthRepository },
  ],
})
export class AuthModule {}
