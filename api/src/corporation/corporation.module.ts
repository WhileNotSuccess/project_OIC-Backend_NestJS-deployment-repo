import { Module } from "@nestjs/common";
import { CorporationService } from "./application/corporation.service";
import { CorporationController } from "./interface/corporation.controller";

@Module({
  controllers: [CorporationController],
  providers: [CorporationService],
})
export class CorporationModule {}
