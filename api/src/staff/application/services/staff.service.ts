import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { StaffRepository } from 'src/staff/infra/repository/staff.repository';

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository:StaffRepository) {}
  
  async create(createStaffDto: CreateStaffDto) {
    await this.staffRepository.createOne(createStaffDto)
  }

  async findAll() {
    // teacher로 구분짓지 말고 group by로 묶어서 처리 
    const staff=await this.staffRepository.getStaff()
    return staff;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    await this.staffRepository.updateOne(id,updateStaffDto)
  }

  async remove(id: number) {
    await this.staffRepository.deleteOne(id)
  }
}
