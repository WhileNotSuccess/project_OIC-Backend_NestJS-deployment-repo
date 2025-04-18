import { PartialType } from "@nestjs/swagger";
import { CreateCountryDto } from "./create-county.dto";

export class UpdateCountryDto extends PartialType(CreateCountryDto) {}
