import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class JwtLinkGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as Express.User;

    request.customData = { ...request.customData, jwtUser: user };

    return canActivate;
  }
}
