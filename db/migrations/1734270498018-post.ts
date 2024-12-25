import { MigrationInterface, QueryRunner } from "typeorm";

export class Post1734270498018 implements MigrationInterface {
    name = 'Post1734270498018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "slug" character varying NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(), "mainImageUrl" character varying NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
