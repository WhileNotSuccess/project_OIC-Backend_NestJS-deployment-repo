import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import * as iconv from "iconv-lite";
import { Request } from "express";

@Injectable()
export class FixOriginalNameInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    // Multer 파일이 존재할 경우
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((file) => this.fixName(file));
      } else {
        // 필드별 다중 파일 구조: { fieldName: [File, File] }
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => this.fixName(file));
        });
      }
    }

    if (req.file) {
      this.fixName(req.file);
    }

    return next.handle();
  }

  private fixName(file: Express.Multer.File) {
    if (file.originalname) {
      const buffer = Buffer.from(file.originalname, "latin1");
      file.originalname = iconv.decode(buffer, "utf8");
    }
  }
}
