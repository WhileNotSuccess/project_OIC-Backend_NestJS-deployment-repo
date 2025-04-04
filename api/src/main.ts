import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger, LoggerService } from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  Logger.overrideLogger(logger);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
