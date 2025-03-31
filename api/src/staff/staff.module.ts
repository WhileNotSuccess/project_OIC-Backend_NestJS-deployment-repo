import { Module } from "@nestjs/common";
import { StaffService } from "./application/service/staff.service";
import { StaffController } from "./interface/staff.controller";
import { StaffRepository } from "./domain/repository/staff.repository";
import { TypeormStaffRepository } from "./infra/repository/typeorm-staff.repository";

@Module({
  controllers: [StaffController],
  providers: [
    StaffService,
    {
      provide: StaffRepository,
      useClass: TypeormStaffRepository,
    },
  ],
})
export class StaffModule {}
