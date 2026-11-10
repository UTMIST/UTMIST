import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum__pages_v_blocks_sponsors_items_asset" AS ENUM('amd', 'modal', 'qualcomm', 'vector', 'google-cloud', 'cohere', 'jarvis', 'rotman', 'tenstorrent', 'aerocoustics-transparent', 'wombo', 'google', 'pwc-transparent', 'rbc', 'edgeai', 'cgi', 'cpsif', 'engsoc', 'compsci');
  CREATE TYPE "payload"."enum__pages_v_blocks_events_items_artwork" AS ENUM('eigenai', 'cucai', 'ai2', 'genai-genesis');
  CREATE TYPE "payload"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."_pages_v_blocks_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"image_alt" varchar,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_impact_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_impact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_sponsors_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"asset" "payload"."enum__pages_v_blocks_sponsors_items_asset",
  	"alt" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_events_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"href" varchar,
  	"artwork" "payload"."enum__pages_v_blocks_events_items_artwork",
  	"image_alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"community_statement" varchar,
  	"list_heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_startups_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_startups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload"."pages" RENAME COLUMN "status" TO "_status";
  ALTER TABLE "payload"."pages_blocks_hero_links" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_hero_links" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_hero" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_hero" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_hero" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "cta_label" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "cta_href" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "image_alt" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "caption" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_impact_statistics" ALTER COLUMN "number" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_impact_statistics" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_impact" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "cta_label" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "cta_href" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors_items" ALTER COLUMN "asset" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors_items" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors_items" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "cta_label" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "cta_href" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "category" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "artwork" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "community_statement" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "list_heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups_benefits" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups_benefits" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "cta_label" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "cta_href" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_faq_items" ALTER COLUMN "question" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_faq_items" ALTER COLUMN "answer" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_faq" ALTER COLUMN "eyebrow" DROP NOT NULL;
  ALTER TABLE "payload"."pages_blocks_faq" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "payload"."pages" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "payload"."pages" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "payload"."_pages_v_blocks_hero_links" ADD CONSTRAINT "_pages_v_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_about" ADD CONSTRAINT "_pages_v_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_impact_statistics" ADD CONSTRAINT "_pages_v_blocks_impact_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_impact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_impact" ADD CONSTRAINT "_pages_v_blocks_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_mission" ADD CONSTRAINT "_pages_v_blocks_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_sponsors_items" ADD CONSTRAINT "_pages_v_blocks_sponsors_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_sponsors" ADD CONSTRAINT "_pages_v_blocks_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_events_items" ADD CONSTRAINT "_pages_v_blocks_events_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_events" ADD CONSTRAINT "_pages_v_blocks_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_startups_benefits" ADD CONSTRAINT "_pages_v_blocks_startups_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_startups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_startups" ADD CONSTRAINT "_pages_v_blocks_startups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_hero_links_order_idx" ON "payload"."_pages_v_blocks_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_links_parent_id_idx" ON "payload"."_pages_v_blocks_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_order_idx" ON "payload"."_pages_v_blocks_about" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_parent_id_idx" ON "payload"."_pages_v_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_path_idx" ON "payload"."_pages_v_blocks_about" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_impact_statistics_order_idx" ON "payload"."_pages_v_blocks_impact_statistics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_impact_statistics_parent_id_idx" ON "payload"."_pages_v_blocks_impact_statistics" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_impact_order_idx" ON "payload"."_pages_v_blocks_impact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_impact_parent_id_idx" ON "payload"."_pages_v_blocks_impact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_impact_path_idx" ON "payload"."_pages_v_blocks_impact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_mission_order_idx" ON "payload"."_pages_v_blocks_mission" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mission_parent_id_idx" ON "payload"."_pages_v_blocks_mission" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mission_path_idx" ON "payload"."_pages_v_blocks_mission" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_sponsors_items_order_idx" ON "payload"."_pages_v_blocks_sponsors_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sponsors_items_parent_id_idx" ON "payload"."_pages_v_blocks_sponsors_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sponsors_order_idx" ON "payload"."_pages_v_blocks_sponsors" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sponsors_parent_id_idx" ON "payload"."_pages_v_blocks_sponsors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sponsors_path_idx" ON "payload"."_pages_v_blocks_sponsors" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_events_items_order_idx" ON "payload"."_pages_v_blocks_events_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_items_parent_id_idx" ON "payload"."_pages_v_blocks_events_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_order_idx" ON "payload"."_pages_v_blocks_events" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_parent_id_idx" ON "payload"."_pages_v_blocks_events" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_path_idx" ON "payload"."_pages_v_blocks_events" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_startups_benefits_order_idx" ON "payload"."_pages_v_blocks_startups_benefits" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_startups_benefits_parent_id_idx" ON "payload"."_pages_v_blocks_startups_benefits" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_startups_order_idx" ON "payload"."_pages_v_blocks_startups" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_startups_parent_id_idx" ON "payload"."_pages_v_blocks_startups" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_startups_path_idx" ON "payload"."_pages_v_blocks_startups" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "payload"."_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "payload"."_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "payload"."_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "payload"."_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "payload"."_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "payload"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "payload"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "payload"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "payload"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "payload"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "payload"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "payload"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "payload"."_pages_v" USING btree ("latest");
  CREATE INDEX "pages__status_idx" ON "payload"."pages" USING btree ("_status");
  ALTER TABLE "payload"."pages_blocks_about" DROP COLUMN "image";
  ALTER TABLE "payload"."pages_blocks_events_items" DROP COLUMN "key";
  DROP TYPE "payload"."enum_pages_blocks_about_image";
  ALTER TABLE "payload"."pages_blocks_impact" ADD COLUMN "description" varchar;
  ALTER TABLE "payload"."_pages_v_blocks_impact" ADD COLUMN "description" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_blocks_about_image" AS ENUM('team-eigenai');
  ALTER TABLE "payload"."_pages_v_blocks_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_impact_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_impact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_mission" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_sponsors_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_events_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_startups_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_startups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."_pages_v_blocks_hero_links" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_hero" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_about" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_impact_statistics" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_impact" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_mission" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_sponsors_items" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_sponsors" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_events_items" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_events" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_startups_benefits" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_startups" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_faq" CASCADE;
  DROP TABLE "payload"."_pages_v" CASCADE;
  ALTER TABLE "payload"."pages" RENAME COLUMN "_status" TO "status";
  DROP INDEX "payload"."pages__status_idx";
  ALTER TABLE "payload"."pages_blocks_hero_links" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_hero_links" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_hero" ALTER COLUMN "eyebrow" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_hero" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_hero" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "eyebrow" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "cta_label" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "cta_href" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "image_alt" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "caption" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_impact_statistics" ALTER COLUMN "number" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_impact_statistics" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_impact" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "eyebrow" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "cta_label" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_mission" ALTER COLUMN "cta_href" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors_items" ALTER COLUMN "asset" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors_items" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors_items" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "eyebrow" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "cta_label" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_sponsors" ALTER COLUMN "cta_href" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "category" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "artwork" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "eyebrow" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "community_statement" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_events" ALTER COLUMN "list_heading" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups_benefits" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups_benefits" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "eyebrow" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "cta_label" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_startups" ALTER COLUMN "cta_href" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_faq_items" ALTER COLUMN "question" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_faq_items" ALTER COLUMN "answer" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_faq" ALTER COLUMN "eyebrow" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_faq" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "payload"."pages" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "payload"."pages" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "payload"."pages_blocks_impact" DROP COLUMN "description";
  ALTER TABLE "payload"."pages_blocks_about" ADD COLUMN "image" "payload"."enum_pages_blocks_about_image" DEFAULT 'team-eigenai' NOT NULL;
  ALTER TABLE "payload"."pages_blocks_about" ALTER COLUMN "image" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_events_items" ADD COLUMN "key" varchar;
  UPDATE "payload"."pages_blocks_events_items" SET "key" = "artwork"::text;
  ALTER TABLE "payload"."pages_blocks_events_items" ALTER COLUMN "key" SET NOT NULL;
  DROP TYPE "payload"."enum__pages_v_blocks_sponsors_items_asset";
  DROP TYPE "payload"."enum__pages_v_blocks_events_items_artwork";
  DROP TYPE "payload"."enum__pages_v_version_status";`)
}
