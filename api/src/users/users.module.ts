import { Module } from "@nestjs/common";
import { UsersController } from "./interface/controller/users.controller";
import { UsersService } from "./application/services/users.service";
import { UsersRepository } from "./domain/repository/users.repository";
import { UsersOrmRepository } from "./infra/repository/typeorm-user.repository";

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: UsersOrmRepository },
  ],
})
export class UsersModule {}
