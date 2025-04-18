import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CorporationService } from "../application/corporation.service";
import { CreateCorporationDto } from "../application/dto/create-corporation.dto";
import { UpdateCorporationDto } from "../application/dto/update-corporation.dto";

@Controller("corporation")
export class CorporationController {
  constructor(private readonly corporationService: CorporationService) {}

  @Post()
  create(@Body() createCorporationDto: CreateCorporationDto) {
    return this.corporationService.create(createCorporationDto);
  }

  @Get()
  findAll() {
    return this.corporationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.corporationService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCorporationDto: UpdateCorporationDto,
  ) {
    return this.corporationService.update(+id, updateCorporationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.corporationService.remove(+id);
  }
}
