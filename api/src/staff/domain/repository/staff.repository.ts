import { Staff } from "../entities/staff.entity";

export interface OrderUpdate {
  id: number;
  order: number;
}
export abstract class StaffRepository {
  abstract create(staffData: Partial<Staff>): Promise<Staff>;
  abstract update(id: number, staffData: Partial<Staff>): Promise<Staff | null>;
  abstract delete(id: number): Promise<boolean>;
  abstract getAll(): Promise<Staff[]>;
  abstract updateOrder(orderUpdate: OrderUpdate[]): Promise<void>;
}
