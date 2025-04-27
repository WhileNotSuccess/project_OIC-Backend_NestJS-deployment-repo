import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

// 로그인 유저
@Injectable()
export class AuthGuard extends NestAuthGuard("jwt") {
  // 전략 로직 수행
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
  // 에러시 작동될 동작
  //   handleRequest<TUser = JwtPayload>(
  //     err: Error | null,
  //     user: TUser | null,
  //     info: string | Error | undefined,
  //     context: ExecutionContext,
  //     status?: any,
  //   ): TUser {
  //     if (err || !user) {
  //       throw new UnauthorizedException("로그인이 필요합니다.");
  //     }
  //     return user;
  //   }
}
