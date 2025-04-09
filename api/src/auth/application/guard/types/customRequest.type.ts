import { Request } from "express";

export interface CustomRequest extends Request {
  customData: {
    jwtUser?: boolean;
    googleUser?: boolean;
  };
  user: { sub: string; email: string; name: string };
  googleId: string;
}
