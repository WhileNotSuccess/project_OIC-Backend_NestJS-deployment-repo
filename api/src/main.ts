import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger, LoggerService } from "@nestjs/common";

import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  Logger.overrideLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle("OIC")
    .setDescription("OIC Backend API Server")
    .setVersion("0.2")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("doc", app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
