import { Injectable } from "@nestjs/common";
import { CreateStaffDto } from "../dto/create-staff.dto";
import { UpdateStaffDto } from "../dto/update-staff.dto";
import { StaffRepository } from "src/staff/domain/repository/staff.repository";
import { Staff } from "src/staff/domain/entities/staff.entity";

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}
  async create(createStaffDto: CreateStaffDto) {
    const staff = new Staff(
      createStaffDto.name,
      createStaffDto.phoneNumber,
      createStaffDto.role,
    );
    return await this.staffRepository.create(staff);
  }

  async findAll() {
    return await this.staffRepository.getAll();
  }

  async findOne(id: number) {
    return await this.staffRepository.getOne(id);
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    const staff: Partial<Staff> = {
      ...(updateStaffDto.name !== undefined && { name: updateStaffDto.name }),
      ...(updateStaffDto.phoneNumber !== undefined && {
        phoneNumber: updateStaffDto.phoneNumber,
      }),
      ...(updateStaffDto.role !== undefined && { role: updateStaffDto.role }),
    };
    return await this.staffRepository.update(id, staff);
  }

  async remove(id: number) {
    return await this.staffRepository.delete(id);
  }
}
