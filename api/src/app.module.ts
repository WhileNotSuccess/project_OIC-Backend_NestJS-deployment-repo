import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StaffModule } from "./staff/staff.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffOrmEntity } from "./staff/infra/entities/staff.entity";
import { PostModule } from "./post/post.module";
import { PostOrmEntity } from "./post/infra/entities/post-orm.entity";

@Module({
  imports: [
    StaffModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "db",
      port: 3306,
      username: "root",
      password: "1234",
      database: "db",
      entities: [StaffOrmEntity, PostOrmEntity],
      synchronize: true,
    }),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
