import { Module } from '@nestjs/common';
import { StaffService } from './application/services/staff.service';
import { StaffController } from './interface/controller/staff.controller';
import { StaffRepository } from './infra/repository/staff.repository';

@Module({
  controllers: [StaffController],
  providers: [StaffService,StaffRepository],
})
export class StaffModule {}
