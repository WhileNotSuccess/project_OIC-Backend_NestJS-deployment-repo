import { PartialType } from "@nestjs/mapped-types";
import { CreatePrideOfYjuDto } from "./create-pride-of-yju.dto";

export class UpdatePrideOfYjuDto extends PartialType(CreatePrideOfYjuDto) {}
