import { User } from "../entities/user.entity";

export interface FindAllUsersOptions {
  page: number;
  limit: number;
  keyword?: string;
  sortBy: "name" | "email" | "createdDate";
  order: "ASC" | "DESC";
}
export abstract class UserRepository {
  abstract save(queryRunner, user: User): Promise<User>;
  abstract updateName(queryRunner, id: number, name: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(userId: number): Promise<User | null>;
  abstract findAll(
    options: FindAllUsersOptions,
  ): Promise<{ users: User[]; total: number }>;
}
