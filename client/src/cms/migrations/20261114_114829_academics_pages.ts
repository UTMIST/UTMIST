import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_academics_pages_topics_sessions_track" AS ENUM('Foundations', 'Frontiers');
  CREATE TYPE "payload"."enum_academics_pages_key" AS ENUM('f2f');
  CREATE TYPE "payload"."enum_academics_pages_kickoff_track" AS ENUM('Foundations', 'Frontiers');
  CREATE TYPE "payload"."enum_academics_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__academics_pages_v_version_topics_sessions_track" AS ENUM('Foundations', 'Frontiers');
  CREATE TYPE "payload"."enum__academics_pages_v_version_key" AS ENUM('f2f');
  CREATE TYPE "payload"."enum__academics_pages_v_version_kickoff_track" AS ENUM('Foundations', 'Frontiers');
  CREATE TYPE "payload"."enum__academics_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."academics_pages_topics_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "track" "payload"."enum_academics_pages_topics_sessions_track",
    "description" varchar,
    "date" varchar,
    "date_time" varchar,
    "time" varchar,
    "location" varchar,
    "resources_slides" varchar,
    "resources_recording" varchar,
    "resources_code" varchar
  );

  CREATE TABLE "payload"."academics_pages_topics" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "title" varchar
  );

  CREATE TABLE "payload"."academics_pages_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "href" varchar,
    "link_label" varchar
  );

  CREATE TABLE "payload"."academics_pages_team" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar,
    "role" varchar,
    "image" varchar,
    "is_director" boolean DEFAULT false
  );

  CREATE TABLE "payload"."academics_pages" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" "payload"."enum_academics_pages_key" DEFAULT 'f2f',
    "hero_eyebrow" varchar,
    "hero_title" varchar,
    "hero_title_continuation" varchar,
    "hero_explore_label" varchar,
    "hero_archive_label" varchar,
    "introduction_heading" varchar,
    "introduction_description" varchar,
    "introduction_foundations_description" varchar,
    "introduction_frontiers_description" varchar,
    "introduction_image" varchar,
    "introduction_image_alt" varchar,
    "workshops_heading" varchar,
    "workshops_description" varchar,
    "workshops_notice" varchar,
    "kickoff_title" varchar,
    "kickoff_track" "payload"."enum_academics_pages_kickoff_track",
    "kickoff_description" varchar,
    "kickoff_date" varchar,
    "kickoff_date_time" varchar,
    "kickoff_time" varchar,
    "kickoff_location" varchar,
    "kickoff_resources_slides" varchar,
    "kickoff_resources_recording" varchar,
    "kickoff_resources_code" varchar,
    "faq_heading" varchar,
    "team_heading" varchar,
    "team_notice" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_academics_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_academics_pages_v_version_topics_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "track" "payload"."enum__academics_pages_v_version_topics_sessions_track",
    "description" varchar,
    "date" varchar,
    "date_time" varchar,
    "time" varchar,
    "location" varchar,
    "resources_slides" varchar,
    "resources_recording" varchar,
    "resources_code" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_academics_pages_v_version_topics" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "title" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_academics_pages_v_version_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "href" varchar,
    "link_label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_academics_pages_v_version_team" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "role" varchar,
    "image" varchar,
    "is_director" boolean DEFAULT false,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_academics_pages_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_key" "payload"."enum__academics_pages_v_version_key" DEFAULT 'f2f',
    "version_hero_eyebrow" varchar,
    "version_hero_title" varchar,
    "version_hero_title_continuation" varchar,
    "version_hero_explore_label" varchar,
    "version_hero_archive_label" varchar,
    "version_introduction_heading" varchar,
    "version_introduction_description" varchar,
    "version_introduction_foundations_description" varchar,
    "version_introduction_frontiers_description" varchar,
    "version_introduction_image" varchar,
    "version_introduction_image_alt" varchar,
    "version_workshops_heading" varchar,
    "version_workshops_description" varchar,
    "version_workshops_notice" varchar,
    "version_kickoff_title" varchar,
    "version_kickoff_track" "payload"."enum__academics_pages_v_version_kickoff_track",
    "version_kickoff_description" varchar,
    "version_kickoff_date" varchar,
    "version_kickoff_date_time" varchar,
    "version_kickoff_time" varchar,
    "version_kickoff_location" varchar,
    "version_kickoff_resources_slides" varchar,
    "version_kickoff_resources_recording" varchar,
    "version_kickoff_resources_code" varchar,
    "version_faq_heading" varchar,
    "version_team_heading" varchar,
    "version_team_notice" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__academics_pages_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "academics_pages_id" integer;
  ALTER TABLE "payload"."academics_pages_topics_sessions" ADD CONSTRAINT "academics_pages_topics_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."academics_pages_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."academics_pages_topics" ADD CONSTRAINT "academics_pages_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."academics_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."academics_pages_faqs" ADD CONSTRAINT "academics_pages_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."academics_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."academics_pages_team" ADD CONSTRAINT "academics_pages_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."academics_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_academics_pages_v_version_topics_sessions" ADD CONSTRAINT "_academics_pages_v_version_topics_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_academics_pages_v_version_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_academics_pages_v_version_topics" ADD CONSTRAINT "_academics_pages_v_version_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_academics_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_academics_pages_v_version_faqs" ADD CONSTRAINT "_academics_pages_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_academics_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_academics_pages_v_version_team" ADD CONSTRAINT "_academics_pages_v_version_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_academics_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_academics_pages_v" ADD CONSTRAINT "_academics_pages_v_parent_id_academics_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."academics_pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "academics_pages_topics_sessions_order_idx" ON "payload"."academics_pages_topics_sessions" USING btree ("_order");
  CREATE INDEX "academics_pages_topics_sessions_parent_id_idx" ON "payload"."academics_pages_topics_sessions" USING btree ("_parent_id");
  CREATE INDEX "academics_pages_topics_order_idx" ON "payload"."academics_pages_topics" USING btree ("_order");
  CREATE INDEX "academics_pages_topics_parent_id_idx" ON "payload"."academics_pages_topics" USING btree ("_parent_id");
  CREATE INDEX "academics_pages_faqs_order_idx" ON "payload"."academics_pages_faqs" USING btree ("_order");
  CREATE INDEX "academics_pages_faqs_parent_id_idx" ON "payload"."academics_pages_faqs" USING btree ("_parent_id");
  CREATE INDEX "academics_pages_team_order_idx" ON "payload"."academics_pages_team" USING btree ("_order");
  CREATE INDEX "academics_pages_team_parent_id_idx" ON "payload"."academics_pages_team" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "academics_pages_key_idx" ON "payload"."academics_pages" USING btree ("key");
  CREATE INDEX "academics_pages_updated_at_idx" ON "payload"."academics_pages" USING btree ("updated_at");
  CREATE INDEX "academics_pages_created_at_idx" ON "payload"."academics_pages" USING btree ("created_at");
  CREATE INDEX "academics_pages__status_idx" ON "payload"."academics_pages" USING btree ("_status");
  CREATE INDEX "_academics_pages_v_version_topics_sessions_order_idx" ON "payload"."_academics_pages_v_version_topics_sessions" USING btree ("_order");
  CREATE INDEX "_academics_pages_v_version_topics_sessions_parent_id_idx" ON "payload"."_academics_pages_v_version_topics_sessions" USING btree ("_parent_id");
  CREATE INDEX "_academics_pages_v_version_topics_order_idx" ON "payload"."_academics_pages_v_version_topics" USING btree ("_order");
  CREATE INDEX "_academics_pages_v_version_topics_parent_id_idx" ON "payload"."_academics_pages_v_version_topics" USING btree ("_parent_id");
  CREATE INDEX "_academics_pages_v_version_faqs_order_idx" ON "payload"."_academics_pages_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_academics_pages_v_version_faqs_parent_id_idx" ON "payload"."_academics_pages_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_academics_pages_v_version_team_order_idx" ON "payload"."_academics_pages_v_version_team" USING btree ("_order");
  CREATE INDEX "_academics_pages_v_version_team_parent_id_idx" ON "payload"."_academics_pages_v_version_team" USING btree ("_parent_id");
  CREATE INDEX "_academics_pages_v_parent_idx" ON "payload"."_academics_pages_v" USING btree ("parent_id");
  CREATE INDEX "_academics_pages_v_version_version_key_idx" ON "payload"."_academics_pages_v" USING btree ("version_key");
  CREATE INDEX "_academics_pages_v_version_version_updated_at_idx" ON "payload"."_academics_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_academics_pages_v_version_version_created_at_idx" ON "payload"."_academics_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_academics_pages_v_version_version__status_idx" ON "payload"."_academics_pages_v" USING btree ("version__status");
  CREATE INDEX "_academics_pages_v_created_at_idx" ON "payload"."_academics_pages_v" USING btree ("created_at");
  CREATE INDEX "_academics_pages_v_updated_at_idx" ON "payload"."_academics_pages_v" USING btree ("updated_at");
  CREATE INDEX "_academics_pages_v_latest_idx" ON "payload"."_academics_pages_v" USING btree ("latest");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academics_pages_fk" FOREIGN KEY ("academics_pages_id") REFERENCES "payload"."academics_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_academics_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("academics_pages_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop this relationship before CASCADE removes it with the Academics table.
  await db.execute(sql`
   ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_academics_pages_fk";
  ALTER TABLE "payload"."academics_pages_topics_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."academics_pages_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."academics_pages_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."academics_pages_team" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."academics_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_academics_pages_v_version_topics_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_academics_pages_v_version_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_academics_pages_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_academics_pages_v_version_team" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_academics_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."academics_pages_topics_sessions" CASCADE;
  DROP TABLE "payload"."academics_pages_topics" CASCADE;
  DROP TABLE "payload"."academics_pages_faqs" CASCADE;
  DROP TABLE "payload"."academics_pages_team" CASCADE;
  DROP TABLE "payload"."academics_pages" CASCADE;
  DROP TABLE "payload"."_academics_pages_v_version_topics_sessions" CASCADE;
  DROP TABLE "payload"."_academics_pages_v_version_topics" CASCADE;
  DROP TABLE "payload"."_academics_pages_v_version_faqs" CASCADE;
  DROP TABLE "payload"."_academics_pages_v_version_team" CASCADE;
  DROP TABLE "payload"."_academics_pages_v" CASCADE;
  DROP INDEX "payload"."payload_locked_documents_rels_academics_pages_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "academics_pages_id";
  DROP TYPE "payload"."enum_academics_pages_topics_sessions_track";
  DROP TYPE "payload"."enum_academics_pages_key";
  DROP TYPE "payload"."enum_academics_pages_kickoff_track";
  DROP TYPE "payload"."enum_academics_pages_status";
  DROP TYPE "payload"."enum__academics_pages_v_version_topics_sessions_track";
  DROP TYPE "payload"."enum__academics_pages_v_version_key";
  DROP TYPE "payload"."enum__academics_pages_v_version_kickoff_track";
  DROP TYPE "payload"."enum__academics_pages_v_version_status";`)
}
