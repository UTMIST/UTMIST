import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_blocks_about_image" AS ENUM('team-eigenai');
  CREATE TYPE "payload"."enum_pages_blocks_sponsors_items_asset" AS ENUM('amd', 'modal', 'qualcomm', 'vector', 'google-cloud', 'cohere', 'jarvis', 'rotman', 'tenstorrent', 'aerocoustics-transparent', 'wombo', 'google', 'pwc-transparent', 'rbc', 'edgeai', 'cgi', 'cpsif', 'engsoc', 'compsci');
  CREATE TYPE "payload"."enum_pages_blocks_events_items_artwork" AS ENUM('eigenai', 'cucai', 'ai2', 'genai-genesis');
  CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."pages_blocks_hero_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "href" varchar NOT NULL
  );

  CREATE TABLE "payload"."pages_blocks_hero" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar NOT NULL,
    "heading" varchar NOT NULL,
    "description" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_about" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar NOT NULL,
    "heading" varchar NOT NULL,
    "description" varchar NOT NULL,
    "cta_label" varchar NOT NULL,
    "cta_href" varchar NOT NULL,
    "image" "payload"."enum_pages_blocks_about_image" NOT NULL,
    "image_alt" varchar NOT NULL,
    "caption" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_impact_statistics" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "number" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  CREATE TABLE "payload"."pages_blocks_impact" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_mission" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar NOT NULL,
    "heading" varchar NOT NULL,
    "description" varchar NOT NULL,
    "cta_label" varchar NOT NULL,
    "cta_href" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_sponsors_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "asset" "payload"."enum_pages_blocks_sponsors_items_asset" NOT NULL,
    "alt" varchar NOT NULL,
    "href" varchar NOT NULL
  );

  CREATE TABLE "payload"."pages_blocks_sponsors" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar NOT NULL,
    "heading" varchar NOT NULL,
    "description" varchar NOT NULL,
    "cta_label" varchar NOT NULL,
    "cta_href" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_events_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL,
    "category" varchar NOT NULL,
    "href" varchar NOT NULL,
    "artwork" "payload"."enum_pages_blocks_events_items_artwork" NOT NULL,
    "image_alt" varchar
  );

  CREATE TABLE "payload"."pages_blocks_events" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar NOT NULL,
    "heading" varchar NOT NULL,
    "description" varchar NOT NULL,
    "community_statement" varchar NOT NULL,
    "list_heading" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_startups_benefits" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  CREATE TABLE "payload"."pages_blocks_startups" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar NOT NULL,
    "heading" varchar NOT NULL,
    "description" varchar NOT NULL,
    "cta_label" varchar NOT NULL,
    "cta_href" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar NOT NULL,
    "answer" varchar NOT NULL
  );

  CREATE TABLE "payload"."pages_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar NOT NULL,
    "heading" varchar NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "status" "payload"."enum_pages_status" DEFAULT 'draft' NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload"."pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_about" ADD CONSTRAINT "pages_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_impact_statistics" ADD CONSTRAINT "pages_blocks_impact_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_impact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_impact" ADD CONSTRAINT "pages_blocks_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_mission" ADD CONSTRAINT "pages_blocks_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_sponsors_items" ADD CONSTRAINT "pages_blocks_sponsors_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_sponsors" ADD CONSTRAINT "pages_blocks_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_events_items" ADD CONSTRAINT "pages_blocks_events_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_events" ADD CONSTRAINT "pages_blocks_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_startups_benefits" ADD CONSTRAINT "pages_blocks_startups_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_startups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_startups" ADD CONSTRAINT "pages_blocks_startups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_links_order_idx" ON "payload"."pages_blocks_hero_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_links_parent_id_idx" ON "payload"."pages_blocks_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "payload"."pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "payload"."pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "payload"."pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_order_idx" ON "payload"."pages_blocks_about" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_parent_id_idx" ON "payload"."pages_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_path_idx" ON "payload"."pages_blocks_about" USING btree ("_path");
  CREATE INDEX "pages_blocks_impact_statistics_order_idx" ON "payload"."pages_blocks_impact_statistics" USING btree ("_order");
  CREATE INDEX "pages_blocks_impact_statistics_parent_id_idx" ON "payload"."pages_blocks_impact_statistics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_impact_order_idx" ON "payload"."pages_blocks_impact" USING btree ("_order");
  CREATE INDEX "pages_blocks_impact_parent_id_idx" ON "payload"."pages_blocks_impact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_impact_path_idx" ON "payload"."pages_blocks_impact" USING btree ("_path");
  CREATE INDEX "pages_blocks_mission_order_idx" ON "payload"."pages_blocks_mission" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_parent_id_idx" ON "payload"."pages_blocks_mission" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_path_idx" ON "payload"."pages_blocks_mission" USING btree ("_path");
  CREATE INDEX "pages_blocks_sponsors_items_order_idx" ON "payload"."pages_blocks_sponsors_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_sponsors_items_parent_id_idx" ON "payload"."pages_blocks_sponsors_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sponsors_order_idx" ON "payload"."pages_blocks_sponsors" USING btree ("_order");
  CREATE INDEX "pages_blocks_sponsors_parent_id_idx" ON "payload"."pages_blocks_sponsors" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sponsors_path_idx" ON "payload"."pages_blocks_sponsors" USING btree ("_path");
  CREATE INDEX "pages_blocks_events_items_order_idx" ON "payload"."pages_blocks_events_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_items_parent_id_idx" ON "payload"."pages_blocks_events_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_order_idx" ON "payload"."pages_blocks_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_parent_id_idx" ON "payload"."pages_blocks_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_path_idx" ON "payload"."pages_blocks_events" USING btree ("_path");
  CREATE INDEX "pages_blocks_startups_benefits_order_idx" ON "payload"."pages_blocks_startups_benefits" USING btree ("_order");
  CREATE INDEX "pages_blocks_startups_benefits_parent_id_idx" ON "payload"."pages_blocks_startups_benefits" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_startups_order_idx" ON "payload"."pages_blocks_startups" USING btree ("_order");
  CREATE INDEX "pages_blocks_startups_parent_id_idx" ON "payload"."pages_blocks_startups" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_startups_path_idx" ON "payload"."pages_blocks_startups" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "payload"."pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "payload"."pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "payload"."pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "payload"."pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "payload"."pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."pages_blocks_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_impact_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_impact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_mission" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_sponsors_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_events_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_startups_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_startups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages" DISABLE ROW LEVEL SECURITY;
  -- Remove the foreign key before CASCADE drops it with the pages table.
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  DROP TABLE "payload"."pages_blocks_hero_links" CASCADE;
  DROP TABLE "payload"."pages_blocks_hero" CASCADE;
  DROP TABLE "payload"."pages_blocks_about" CASCADE;
  DROP TABLE "payload"."pages_blocks_impact_statistics" CASCADE;
  DROP TABLE "payload"."pages_blocks_impact" CASCADE;
  DROP TABLE "payload"."pages_blocks_mission" CASCADE;
  DROP TABLE "payload"."pages_blocks_sponsors_items" CASCADE;
  DROP TABLE "payload"."pages_blocks_sponsors" CASCADE;
  DROP TABLE "payload"."pages_blocks_events_items" CASCADE;
  DROP TABLE "payload"."pages_blocks_events" CASCADE;
  DROP TABLE "payload"."pages_blocks_startups_benefits" CASCADE;
  DROP TABLE "payload"."pages_blocks_startups" CASCADE;
  DROP TABLE "payload"."pages_blocks_faq_items" CASCADE;
  DROP TABLE "payload"."pages_blocks_faq" CASCADE;
  DROP TABLE "payload"."pages" CASCADE;
  DROP INDEX "payload"."payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "pages_id";
  DROP TYPE "payload"."enum_pages_blocks_about_image";
  DROP TYPE "payload"."enum_pages_blocks_sponsors_items_asset";
  DROP TYPE "payload"."enum_pages_blocks_events_items_artwork";
  DROP TYPE "payload"."enum_pages_status";`)
}
