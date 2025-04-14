import { Module } from "@nestjs/common";
import { MediaModule } from "src/media/media.module";
import { PrideOfYjuController } from "./interface/controllers/pride-of-yju.controller";
import { PrideOfYjuService } from "./application/services/pride-of-yju.service";
import { TypeormPrideOfYjuRepository } from "./infra/repository/typeorm-pride-of-yju.repository";
import { PrideOfYjuRepository } from "./domain/repository/pride-of-yju.repository";

@Module({
  imports: [MediaModule],
  controllers: [PrideOfYjuController],
  providers: [
    PrideOfYjuService,
    {
      provide: PrideOfYjuRepository,
      useClass: TypeormPrideOfYjuRepository,
    },
  ],
})
export class PrideOfYjuModule {}
