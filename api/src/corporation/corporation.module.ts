import { Module } from "@nestjs/common";
import { CorporationService } from "./application/corporation.service";
import { CorporationController } from "./interface/corporation.controller";
import { CorporationRepository } from "./domain/repository/corporation.repository";
import { TypeormCorporationRepository } from "./infra/repository/typeorm-corporation.repository";

@Module({
  controllers: [CorporationController],
  providers: [
    CorporationService,
    {
      provide: CorporationRepository,
      useClass: TypeormCorporationRepository,
    },
  ],
})
export class CorporationModule {}
