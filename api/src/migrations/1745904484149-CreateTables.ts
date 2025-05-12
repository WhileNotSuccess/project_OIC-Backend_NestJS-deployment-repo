import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1745904484149 implements MigrationInterface {
    name = 'CreateTables1745904484149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`auth\` (\`userId\` int NOT NULL, \`hashedPassword\` varchar(255) NULL, \`googleId\` varchar(255) NULL, PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`auth\` ADD CONSTRAINT \`FK_373ead146f110f04dad60848154\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_373ead146f110f04dad60848154\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`auth\``);
    }

}
