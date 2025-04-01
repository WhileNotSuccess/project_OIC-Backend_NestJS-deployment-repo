import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { StaffService } from "../application/service/staff.service";
import { CreateStaffDto } from "../application/dto/create-staff.dto";
import { UpdateStaffDto } from "../application/dto/update-staff.dto";

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const staff = await this.staffService.findOne(+id);
    if (!staff) {
      throw new NotFoundException("Staff not found");
    }
    return staff;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.staffService.remove(+id);
  }
}
