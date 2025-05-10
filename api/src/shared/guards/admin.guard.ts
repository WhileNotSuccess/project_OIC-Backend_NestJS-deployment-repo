import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

// 관리자 확인 가드
@Injectable()
export class AdminGuard extends NestAuthGuard("admin") {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
