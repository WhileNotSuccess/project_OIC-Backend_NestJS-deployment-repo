import { Module } from "@nestjs/common";
import { UsersController } from "./interface/controllers/user.controller";
import { ChangeUserName } from "./application/use-cases/change-user-name-use-case";
import { GetAllUsersUseCase } from "./application/use-cases/get-all-users.use-case";
import { GetUserInfo } from "./application/use-cases/get-user-info.use-case";
import { UserRepository } from "./domain/repositories/user.repository";
import { TypeormUserRepository } from "./infra/repositories/typeorm-user.repository";

@Module({
  exports: [GetUserInfo, UserRepository],
  controllers: [UsersController],
  providers: [
    ChangeUserName,
    GetAllUsersUseCase,
    GetUserInfo,
    {
      useClass: TypeormUserRepository,
      provide: UserRepository,
    },
  ],
})
export class UserModule {}
