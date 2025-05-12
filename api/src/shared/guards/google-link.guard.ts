import { AuthGuard as NestAuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class GoogleLinkAuthGuard extends NestAuthGuard("googleLink") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as unknown as string;
    request.customData = { ...request.customData, googleUser: user };
    // 기존 customData를 유지하고 googleUser를 추가
    // request.customData:{googleUser,jwtUser}식이 됨

    return canActivate;
  }
}
