import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1719510126063 implements MigrationInterface {
    name = 'NewMigration1719510126063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "toggle_likes" ("user_id" integer NOT NULL, "post_id" integer NOT NULL, CONSTRAINT "PK_9a957e78783dcaad68b34acc7a8" PRIMARY KEY ("user_id", "post_id"))`);
        await queryRunner.query(`CREATE TABLE "device_tokens" ("id" SERIAL NOT NULL, "token" text NOT NULL, "user_id" integer NOT NULL, "device_type" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0ae782b60bb412c830d8dca38b1" PRIMARY KEY ("id", "user_id"))`);
        await queryRunner.query(`CREATE TABLE "user_sessions" ("id" SERIAL NOT NULL, "access_token" text NOT NULL, "user_id" integer NOT NULL, "access_token_expiration_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_03e66997668e1b5e412acddf44e" PRIMARY KEY ("id", "user_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teachers" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "school_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "absence" ("student_id" integer NOT NULL, "class_id" integer NOT NULL, "daily_schedule_id" integer NOT NULL, CONSTRAINT "PK_6697670a15208b30bdf1e4b6e10" PRIMARY KEY ("student_id", "class_id", "daily_schedule_id"))`);
        await queryRunner.query(`CREATE TABLE "daily_schedules" ("id" SERIAL NOT NULL, "class_id" integer NOT NULL, "schedule_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_64483e08777888f69c9a5630420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "eating_schedules" ("id" SERIAL NOT NULL, "class_id" integer NOT NULL, "schedule_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_24cc94f042efe199c8b15375494" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "teacher_id" integer NOT NULL, "school_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "class_students" ("class_id" integer NOT NULL, "student_id" integer NOT NULL, CONSTRAINT "PK_ebae351dd2d5e456290bba051a9" PRIMARY KEY ("class_id", "student_id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "school_id" integer NOT NULL, "parent_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schools" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_95b932e47ac129dd8e23a0db548" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "url" character varying(255) NOT NULL, "post_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "school_id" integer NOT NULL, "created_by" integer NOT NULL, "status" character varying NOT NULL, "published_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "content" text NOT NULL, "post_id" integer NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_tags" ("comment_id" integer NOT NULL, "user_id" integer NOT NULL, "placeholder_number" integer NOT NULL, CONSTRAINT "PK_3eb4a770365416f0e773323021f" PRIMARY KEY ("comment_id", "user_id", "placeholder_number"))`);
        await queryRunner.query(`CREATE TABLE "school_admins" ("user_id" integer NOT NULL, "school_id" integer NOT NULL, CONSTRAINT "PK_433d58a5416656915a4304233f4" PRIMARY KEY ("user_id", "school_id"))`);
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" SERIAL NOT NULL, "tag" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_0b4ef8e83392129fb3373fdb3af" UNIQUE ("tag"), CONSTRAINT "PK_994c5bf9151587560db430018c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts_hashtags" ("post_id" integer NOT NULL, "hash_tag_id" integer NOT NULL, "placeholderNumber" integer NOT NULL, CONSTRAINT "PK_18fbfad8d687cce1687e0f734f9" PRIMARY KEY ("post_id", "hash_tag_id", "placeholderNumber"))`);
        await queryRunner.query(`ALTER TABLE "toggle_likes" ADD CONSTRAINT "FK_54d19a7d2bc3ad9f50f3211c8e1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toggle_likes" ADD CONSTRAINT "FK_323e11860056ff731f755885102" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_tokens" ADD CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_e9658e959c490b0a634dfc54783" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teachers" ADD CONSTRAINT "FK_5656d1b6d40765ea6b135b35d4b" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "absence" ADD CONSTRAINT "FK_90e6580c28db7184ad0217d4de6" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "absence" ADD CONSTRAINT "FK_44ffbf1e6e31ac9fe65af8d867f" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "absence" ADD CONSTRAINT "FK_8f828d40ce3a65bcd95cc6eb1bb" FOREIGN KEY ("daily_schedule_id") REFERENCES "daily_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_schedules" ADD CONSTRAINT "FK_ad5b862474c9a74f3852f68eeba" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "eating_schedules" ADD CONSTRAINT "FK_e227599b0f50494842d71949c86" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes" ADD CONSTRAINT "FK_b34c92e413c4debb6e0f23fed46" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes" ADD CONSTRAINT "FK_398f3990f5da4a1efda173f576f" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_students" ADD CONSTRAINT "FK_43e081daadb906f3dc41bb267dd" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_students" ADD CONSTRAINT "FK_6d12f65ab61f9f92e3d7e95ad23" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_aa8edc7905ad764f85924569647" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_209313beb8d3f51f7ad69214d90" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_ca0ed9873891665fff3d9d39cc2" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_69247d231c2c01f40e0aa4dd4fa" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_5e508187fcc1b87d59e3673c766" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tags" ADD CONSTRAINT "FK_f1454005e7c0f12311a17bba985" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tags" ADD CONSTRAINT "FK_1876d8f8eff4211b216364381ec" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "school_admins" ADD CONSTRAINT "FK_a3dfdd5b8a66a0343c0bc0b6266" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "school_admins" ADD CONSTRAINT "FK_7d7af2ca719ea99824104d57360" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_hashtags" ADD CONSTRAINT "FK_21fdc84b0e3b570a6ecba191bce" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_hashtags" ADD CONSTRAINT "FK_eb8b21c0157634fb28694f97987" FOREIGN KEY ("hash_tag_id") REFERENCES "hashtags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_hashtags" DROP CONSTRAINT "FK_eb8b21c0157634fb28694f97987"`);
        await queryRunner.query(`ALTER TABLE "posts_hashtags" DROP CONSTRAINT "FK_21fdc84b0e3b570a6ecba191bce"`);
        await queryRunner.query(`ALTER TABLE "school_admins" DROP CONSTRAINT "FK_7d7af2ca719ea99824104d57360"`);
        await queryRunner.query(`ALTER TABLE "school_admins" DROP CONSTRAINT "FK_a3dfdd5b8a66a0343c0bc0b6266"`);
        await queryRunner.query(`ALTER TABLE "user_tags" DROP CONSTRAINT "FK_1876d8f8eff4211b216364381ec"`);
        await queryRunner.query(`ALTER TABLE "user_tags" DROP CONSTRAINT "FK_f1454005e7c0f12311a17bba985"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_5e508187fcc1b87d59e3673c766"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_69247d231c2c01f40e0aa4dd4fa"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_ca0ed9873891665fff3d9d39cc2"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_209313beb8d3f51f7ad69214d90"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_aa8edc7905ad764f85924569647"`);
        await queryRunner.query(`ALTER TABLE "class_students" DROP CONSTRAINT "FK_6d12f65ab61f9f92e3d7e95ad23"`);
        await queryRunner.query(`ALTER TABLE "class_students" DROP CONSTRAINT "FK_43e081daadb906f3dc41bb267dd"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP CONSTRAINT "FK_398f3990f5da4a1efda173f576f"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP CONSTRAINT "FK_b34c92e413c4debb6e0f23fed46"`);
        await queryRunner.query(`ALTER TABLE "eating_schedules" DROP CONSTRAINT "FK_e227599b0f50494842d71949c86"`);
        await queryRunner.query(`ALTER TABLE "daily_schedules" DROP CONSTRAINT "FK_ad5b862474c9a74f3852f68eeba"`);
        await queryRunner.query(`ALTER TABLE "absence" DROP CONSTRAINT "FK_8f828d40ce3a65bcd95cc6eb1bb"`);
        await queryRunner.query(`ALTER TABLE "absence" DROP CONSTRAINT "FK_44ffbf1e6e31ac9fe65af8d867f"`);
        await queryRunner.query(`ALTER TABLE "absence" DROP CONSTRAINT "FK_90e6580c28db7184ad0217d4de6"`);
        await queryRunner.query(`ALTER TABLE "teachers" DROP CONSTRAINT "FK_5656d1b6d40765ea6b135b35d4b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_e9658e959c490b0a634dfc54783"`);
        await queryRunner.query(`ALTER TABLE "device_tokens" DROP CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea"`);
        await queryRunner.query(`ALTER TABLE "toggle_likes" DROP CONSTRAINT "FK_323e11860056ff731f755885102"`);
        await queryRunner.query(`ALTER TABLE "toggle_likes" DROP CONSTRAINT "FK_54d19a7d2bc3ad9f50f3211c8e1"`);
        await queryRunner.query(`DROP TABLE "posts_hashtags"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
        await queryRunner.query(`DROP TABLE "school_admins"`);
        await queryRunner.query(`DROP TABLE "user_tags"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "schools"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "class_students"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TABLE "eating_schedules"`);
        await queryRunner.query(`DROP TABLE "daily_schedules"`);
        await queryRunner.query(`DROP TABLE "absence"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
        await queryRunner.query(`DROP TABLE "device_tokens"`);
        await queryRunner.query(`DROP TABLE "toggle_likes"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
