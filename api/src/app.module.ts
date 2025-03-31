import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {ServeStaticModule} from '@nestjs/serve-static'
import {ConfigModule, ConfigService} from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from "./staff/infra/entities/staff.entity";
import { StaffModule } from "./staff/staff.module";
import { PostsModule } from "./posts/posts.module";
import { CarouselModule } from './carousel/carousel.module';
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { PrideOfYjuModule } from "./pride-of-yju/pride-of-yju.module";
import { BatchModule } from "./batch/batch.module";
import { PrideOfYju } from "./pride-of-yju/entities/pride-of-yju.entity";
import { Post } from "./posts/entities/post.entity";
import { Carousel } from "./carousel/entities/carousel.entity";
import { Attachment } from "./attachments/entities/attachment.entity";
import { AttachmentsModule } from "./attachments/attachments.module";


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:'/files',
      serveRoot:'/api',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: 3306,
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [
          Staff,
          PrideOfYju,
          Post,
          Carousel,
          Attachment
        ],
        synchronize: false,
      }),
    }),
    AttachmentsModule,
    StaffModule,
    PostsModule,
    CarouselModule,
    AuthModule,
    UsersModule,
    CarouselModule,
    EmailModule,
    PrideOfYjuModule,
    BatchModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
