import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { PasswordService } from "../../domain/services/password.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BcryptPasswordService implements PasswordService {
  saltRounds: string;
  constructor(private readonly configService: ConfigService) {
    this.saltRounds = this.configService.get("SALT_ROUNDS") || "10";
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(plain: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plain, hashedPassword);
  }
}
