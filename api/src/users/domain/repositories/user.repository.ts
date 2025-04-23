import { User } from "../entities/user.entity";

export interface FindAllUsersOptions {
  page: number;
  limit: number;
  keyword?: string;
  sortBy: "name" | "email" | "createdDate";
  order: "ASC" | "DESC";
}
export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(userId: string): Promise<User | null>;
  abstract findAll(
    options: FindAllUsersOptions,
  ): Promise<{ user: User[]; total: number }>;
}
