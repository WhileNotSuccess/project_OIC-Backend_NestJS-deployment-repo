/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1745205379717 implements MigrationInterface {
  name = "CreateTables1745205379717";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`staff_orm_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`position\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`team\` varchar(255) NOT NULL, \`position_jp\` varchar(255) NOT NULL, \`team_jp\` varchar(255) NOT NULL, \`position_en\` varchar(255) NOT NULL, \`team_en\` varchar(255) NOT NULL, \`role\` varchar(255) NULL, \`role_en\` varchar(255) NULL, \`role_jp\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pride_of_yju_orm_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(255) NOT NULL, \`korean\` varchar(255) NOT NULL, \`english\` varchar(255) NOT NULL, \`japanese\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`attachment_orm_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`url\` varchar(150) NOT NULL, \`originalName\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`post_image_orm_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`filename\` varchar(100) NOT NULL, \`fileSize\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`post_orm_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` longtext NOT NULL, \`userId\` int NOT NULL, \`category\` varchar(255) NOT NULL, \`language\` enum ('korean', 'english', 'japanese') NOT NULL DEFAULT 'korean', \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`corporation_orm_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`countryId\` int NOT NULL, \`koreanName\` varchar(255) NOT NULL, \`englishName\` varchar(255) NOT NULL, \`corporationType\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`country_orm_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`englishName\` varchar(255) NOT NULL, \`japaneseName\` varchar(255) NOT NULL, \`x\` int NOT NULL, \`y\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`carousel_orm_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(255) NOT NULL, \`postId\` int NOT NULL, \`koreanTitle\` varchar(255) NOT NULL, \`koreanDescription\` varchar(255) NOT NULL, \`englishTitle\` varchar(255) NOT NULL, \`englishDescription\` varchar(255) NOT NULL, \`japaneseTitle\` varchar(255) NOT NULL, \`japaneseDescription\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachment_orm_entity\` ADD CONSTRAINT \`FK_5831c8d770ea525c5a44613a329\` FOREIGN KEY (\`postId\`) REFERENCES \`post_orm_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_image_orm_entity\` ADD CONSTRAINT \`FK_fc05634b51acfe8a0ac79ee1c69\` FOREIGN KEY (\`postId\`) REFERENCES \`post_orm_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`corporation_orm_entity\` ADD CONSTRAINT \`FK_d537672228fbd612dbad40648a3\` FOREIGN KEY (\`countryId\`) REFERENCES \`country_orm_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`corporation_orm_entity\` DROP FOREIGN KEY \`FK_d537672228fbd612dbad40648a3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_image_orm_entity\` DROP FOREIGN KEY \`FK_fc05634b51acfe8a0ac79ee1c69\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachment_orm_entity\` DROP FOREIGN KEY \`FK_5831c8d770ea525c5a44613a329\``,
    );
    await queryRunner.query(`DROP TABLE \`carousel_orm_entity\``);
    await queryRunner.query(`DROP TABLE \`country_orm_entity\``);
    await queryRunner.query(`DROP TABLE \`corporation_orm_entity\``);
    await queryRunner.query(`DROP TABLE \`post_orm_entity\``);
    await queryRunner.query(`DROP TABLE \`post_image_orm_entity\``);
    await queryRunner.query(`DROP TABLE \`attachment_orm_entity\``);
    await queryRunner.query(`DROP TABLE \`pride_of_yju_orm_entity\``);
    await queryRunner.query(`DROP TABLE \`staff_orm_entity\``);
  }
}
