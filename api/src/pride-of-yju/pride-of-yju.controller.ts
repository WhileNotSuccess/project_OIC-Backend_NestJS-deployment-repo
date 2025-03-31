import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrideOfYjuService } from './pride-of-yju.service';
import { CreatePrideOfYjuDto } from './dto/create-pride-of-yju.dto';
import { UpdatePrideOfYjuDto } from './dto/update-pride-of-yju.dto';

@Controller('pride-of-yju')
export class PrideOfYjuController {
  constructor(private readonly prideOfYjuService: PrideOfYjuService) {}

  @Post()
  create(@Body() createPrideOfYjuDto: CreatePrideOfYjuDto) {
    return this.prideOfYjuService.create(createPrideOfYjuDto);
  }

  @Get()
  findAll() {
    return this.prideOfYjuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prideOfYjuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrideOfYjuDto: UpdatePrideOfYjuDto) {
    return this.prideOfYjuService.update(+id, updatePrideOfYjuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prideOfYjuService.remove(+id);
  }
}
