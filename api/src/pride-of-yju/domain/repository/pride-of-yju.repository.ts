import { PrideOfYju } from "../entities/pride-of-yju.entity";

export abstract class PrideOfYjuRepository {
  abstract create(POY: Partial<PrideOfYju>): Promise<PrideOfYju>;
  abstract update(
    id: number,
    POY: Partial<PrideOfYju>,
  ): Promise<PrideOfYju | null>;
  abstract delete(id: number): Promise<boolean>;
  abstract getOne(id: number): Promise<PrideOfYju | null>;
  abstract getAll(): Promise<PrideOfYju[]>;
}
