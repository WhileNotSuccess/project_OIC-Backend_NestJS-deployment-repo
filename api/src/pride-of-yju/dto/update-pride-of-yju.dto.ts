import { PartialType } from '@nestjs/swagger';
import { CreatePrideOfYjuDto } from './create-pride-of-yju.dto';

export class UpdatePrideOfYjuDto extends PartialType(CreatePrideOfYjuDto) {}
