import { Users } from "../entities/users.entity";

export abstract class UsersRepository {
  //생성된 User 반환, 이미 같은 email의 유저가 있을 경우 null을 반환
  abstract create(usersData: Users): Promise<Users | null>;
  //생성됐는지의 여부를 boolean으로 판독, 유저가 없을 경우 null반환
  abstract updateName(id: number, name: string): Promise<boolean | null>;
  //삭제됐는지의 여부를 boolean으로 판독, 없었던 user일 경우에는?
  abstract delete(id: number): Promise<boolean>;

  abstract getOneByEmail(email: string): Promise<Users | null>;
  abstract getOneByGoogleId(googleId: string): Promise<Users | null>;
  abstract getAll(): Promise<Users[] | null>;
}
