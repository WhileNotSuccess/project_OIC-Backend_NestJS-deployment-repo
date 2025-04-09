import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CustomRequest } from "./types/customRequest.type";

@Injectable()
export class JwtLinkGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;

    const request: CustomRequest = context.switchToHttp().getRequest();
    const user = request.user;
    request.customData = { ...request.customData, jwtUser: !!user };

    return canActivate;
  }
}
