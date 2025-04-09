import { Injectable } from "@nestjs/common";
import { Users } from "src/users/domain/entities/users.entity";
import { UsersRepository } from "src/users/domain/repository/users.repository";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  constructor(
    private readonly Repository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async AllUsersInfo() {
    const userData = await this.Repository.getAll();
    return userData;
  }

  async userNameChange(id: number, name: string) {
    return await this.Repository.updateName(id, name);
  }

  checkAdminEmail(user: Partial<Users>) {
    const adminEmail = this.configService.get<string>("ADMIN_EMAIL");
    return user.email == adminEmail;
  }
}
