import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StaffModule } from "./staff/staff.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffOrmEntity } from "./staff/infra/entities/staff.entity";
import { PostModule } from "./post/post.module";
import { PostOrmEntity } from "./post/infra/entities/post-orm.entity";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { APP_FILTER } from "@nestjs/core";
import { HttpFilter } from "./common/http.filter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MediaModule } from "./media/media.module";
import { CarouselModule } from "./carousel/carousel.module";
import { PrideOfYjuModule } from "./pride-of-yju/pride-of-yju.module";
import { PostImageOrmEntity } from "./post/infra/entities/post-image-orm.entity";
import { AttachmentOrmEntity } from "./post/infra/entities/attachment-orm.entity";
import { CorporationModule } from "./corporation/corporation.module";
import { CarouselOrmEntity } from "./carousel/infra/entities/carousel.entity";
import { CorporationOrmEntity } from "./corporation/infra/entities/corporation.entity";
import { CountryOrmEntity } from "./corporation/infra/entities/country.entity";
import { PrideOfYjuOrmEntity } from "./pride-of-yju/infra/entities/pride-of-yju.entity";
import { ServeStaticModule } from "@nestjs/serve-static";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: "/files",
      serveRoot: "/api/files",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: config.get<"mysql" | "mariadb" | "postgres">("DB_TYPE", "mysql"),
        host: config.getOrThrow<string>("DB_HOST"),
        port: config.getOrThrow<number>("DB_PORT") || 3306,
        username: config.getOrThrow<string>("DB_USERNAME"),
        password: config.getOrThrow<string>("DB_PASSWORD"),
        database: config.getOrThrow<string>("DB_DATABASE"),
        entities: [
          StaffOrmEntity,
          PostOrmEntity,
          PostImageOrmEntity,
          AttachmentOrmEntity,
          CarouselOrmEntity,
          CorporationOrmEntity,
          CountryOrmEntity,
          PrideOfYjuOrmEntity,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "development" ? "silly" : "info",
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
              ({
                timestamp,
                level,
                message,
              }: {
                timestamp: string;
                level: string;
                message: string;
              }) => {
                return `${timestamp} [${level}]: ${message}`;
              },
            ),
          ),
        }),
        new winston.transports.File({
          filename: "OIC.log",
          level: "warn",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              ({
                timestamp,
                level,
                message,
              }: {
                timestamp: string;
                level: string;
                message: string;
              }) => {
                return `${timestamp} [${level}]: ${message}`;
              },
            ),
          ),
        }),
      ],
    }),
    PostModule,
    StaffModule,
    MediaModule,
    CarouselModule,
    PrideOfYjuModule,
    CorporationModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpFilter,
    },
  ],
})
export class AppModule {}
