import { Injectable } from "@nestjs/common";
import { CreateStaffDto } from "../dto/create-staff.dto";
import { UpdateStaffDto } from "../dto/update-staff.dto";
import { StaffRepository } from "src/staff/domain/repository/staff.repository";
import { Language } from "src/common/types/language";
import { toLanguageEnum } from "src/common/utils/to-language-enum";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { Order } from "../types/update-order";

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}
  async create(createStaffDto: CreateStaffDto) {
    return await this.staffRepository.create(createStaffDto);
  }

  async findAll(language: Language) {
    const result = await this.staffRepository.getAll();
    const teams =
      language === toLanguageEnum("english")
        ? result.map((item) => item.team_en)
        : language === toLanguageEnum("japanese")
          ? result.map((item) => item.team_jp)
          : result.map((item) => item.team);

    const group = {};
    for (let index = 0; index < teams.length; index++) {
      const element = teams[index];
      group[element] = result
        .filter((item) => {
          return language === toLanguageEnum("english")
            ? item.team_en === element
            : language === toLanguageEnum("japanese")
              ? item.team_jp === element
              : item.team === element;
        })
        .map((item) => {
          if (language === toLanguageEnum("english")) {
            return {
              name: item.name,
              phone: item.phone,
              email: item.email,
              position: item.position_en,
              team: item.team_en,
              role: item.role_en,
              id: item.id,
              order: item.order,
            };
          } else if (language === toLanguageEnum("japanese")) {
            return {
              name: item.name,
              phone: item.phone,
              email: item.email,
              position: item.position_jp,
              team: item.team_jp,
              role: item.role_jp,
              id: item.id,
              order: item.order,
            };
          } else {
            return {
              name: item.name,
              phone: item.phone,
              email: item.email,
              position: item.position,
              team: item.team,
              role: item.role,
              id: item.id,
              order: item.order,
            };
          }
        });
    }
    return group;
  }

  async findAllWithoutLanguage() {
    const result = await this.staffRepository.getAll();
    const teams = result.map((item) => item.team);
    const group = {};
    for (let index = 0; index < teams.length; index++) {
      const element = teams[index];
      group[element] = result.filter((item) => item.team === element);
    }
    return group;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    return await this.staffRepository.update(id, updateStaffDto);
  }

  async remove(id: number) {
    return await this.staffRepository.delete(id);
  }

  async changeOrder(orders: UpdateOrderDto) {
    const result: Order[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(orders.orders).map(([team, orderList]) => {
      const order = orderList as Order[];
      order.map((order) => {
        result.push({
          id: order.id,
          order: order.order,
        });
      });
    });

    await this.staffRepository.updateOrder(result);
  }
}
