import { Injectable } from "@nestjs/common";
import { transactional } from "src/common/utils/transaction-helper";
import { DataSource } from "typeorm";
import { Staff } from "../entities/staff.entity";
import { CreateStaffDto } from "src/staff/application/dto/create-staff.dto";
import { UpdateStaffDto } from "src/staff/application/dto/update-staff.dto";

@Injectable()
export class StaffRepository{
    constructor(private readonly dataSource:DataSource){}

    async getStaff(){
        const staff=
            await this.dataSource.manager
            .createQueryBuilder()
            .select('team')
            .addSelect('JSON_ARRAYAGG(JSON_OBJECT("id",id,"name",name, "email",email,"phone",phone, "role",role, "position",position))', 'member')
            .from(Staff, 'staff')
            .groupBy('team')
            .execute()
        return staff
    }

    async createOne(createStaffDto:CreateStaffDto){
        await transactional<void>(this.dataSource,async queryRunner=>{
            await queryRunner.manager.save(Staff,createStaffDto)
        })
    }

    async deleteOne(id:number){
        await transactional(this.dataSource,async queryRunner=>{
            await queryRunner.manager.delete(Staff,id)
        })
    }
    
    async updateOne(id:number,updateStaffDto:UpdateStaffDto){
        await transactional(this.dataSource,async queryRunner=>{
            await queryRunner.manager.update(Staff,id,updateStaffDto)
        })
    }
}