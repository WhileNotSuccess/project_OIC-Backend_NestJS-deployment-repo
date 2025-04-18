import { Staff } from "../entities/staff.entity";

export abstract class StaffRepository {
  abstract create(staffData: Partial<Staff>): Promise<Staff>;
  abstract update(id: number, staffData: Partial<Staff>): Promise<Staff | null>;
  abstract delete(id: number): Promise<boolean>;
  abstract getAll(): Promise<Staff[]>;
}
