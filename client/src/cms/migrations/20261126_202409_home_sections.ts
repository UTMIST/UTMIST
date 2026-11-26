import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_blocks_events_items_artwork" AS ENUM('eigenai', 'cucai', 'ai2', 'genai-genesis');
  CREATE TYPE "payload"."enum__pages_v_blocks_events_items_artwork" AS ENUM('eigenai', 'cucai', 'ai2', 'genai-genesis');
  CREATE TABLE "payload"."pages_blocks_hero_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar
  );

  CREATE TABLE "payload"."pages_blocks_hero" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "description" varchar,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_about" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "description" varchar,
    "cta_label" varchar,
    "cta_href" varchar,
    "image_alt" varchar,
    "caption" varchar,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_impact_statistics" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "number" varchar,
    "description" varchar
  );

  CREATE TABLE "payload"."pages_blocks_impact" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar,
    "description" varchar,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_mission" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "description" varchar,
    "cta_label" varchar,
    "cta_href" varchar,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_sponsors" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "description" varchar,
    "cta_label" varchar,
    "cta_href" varchar,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_events_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "event_id" integer,
    "category" varchar,
    "artwork" "payload"."enum_pages_blocks_events_items_artwork",
    "image_alt" varchar
  );

  CREATE TABLE "payload"."pages_blocks_events" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "description" varchar,
    "community_statement" varchar,
    "list_heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_startups_benefits" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "description" varchar
  );

  CREATE TABLE "payload"."pages_blocks_startups" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "description" varchar,
    "cta_label" varchar,
    "cta_href" varchar,
    "block_name" varchar
  );

  CREATE TABLE "payload"."pages_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar
  );

  CREATE TABLE "payload"."pages_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar,
    "block_name" varchar
  );

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
    "description" varchar,
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
    "event_id" integer,
    "category" varchar,
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

  ALTER TABLE "payload"."partners" ADD COLUMN "show_on_home" boolean DEFAULT false;
  ALTER TABLE "payload"."_partners_v" ADD COLUMN "version_show_on_home" boolean DEFAULT false;
  -- Keep the existing homepage sponsor roster on databases seeded before this flag.
  UPDATE "payload"."partners" SET "show_on_home" = true
    WHERE "slug" IN ('amd', 'modal', 'qualcomm', 'vector-institute', 'google-cloud', 'cohere',
    'jarvis', 'rotman-school-of-management', 'tenstorrent', 'aercoustics', 'wombo',
    'google', 'pwc', 'rbc', 'edge-ai', 'cgi', 'cpsif', 'engineering-society',
    'department-of-computer-science');
  UPDATE "payload"."_partners_v" SET "version_show_on_home" = true
    WHERE "version_slug" IN ('amd', 'modal', 'qualcomm', 'vector-institute', 'google-cloud', 'cohere',
    'jarvis', 'rotman-school-of-management', 'tenstorrent', 'aercoustics', 'wombo',
    'google', 'pwc', 'rbc', 'edge-ai', 'cgi', 'cpsif', 'engineering-society',
    'department-of-computer-science');

  ALTER TABLE "payload"."pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_about" ADD CONSTRAINT "pages_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_impact_statistics" ADD CONSTRAINT "pages_blocks_impact_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_impact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_impact" ADD CONSTRAINT "pages_blocks_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_mission" ADD CONSTRAINT "pages_blocks_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_sponsors" ADD CONSTRAINT "pages_blocks_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_events_items" ADD CONSTRAINT "pages_blocks_events_items_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_events_items" ADD CONSTRAINT "pages_blocks_events_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_events" ADD CONSTRAINT "pages_blocks_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_startups_benefits" ADD CONSTRAINT "pages_blocks_startups_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_startups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_startups" ADD CONSTRAINT "pages_blocks_startups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero_links" ADD CONSTRAINT "_pages_v_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_about" ADD CONSTRAINT "_pages_v_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_impact_statistics" ADD CONSTRAINT "_pages_v_blocks_impact_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_impact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_impact" ADD CONSTRAINT "_pages_v_blocks_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_mission" ADD CONSTRAINT "_pages_v_blocks_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_sponsors" ADD CONSTRAINT "_pages_v_blocks_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_events_items" ADD CONSTRAINT "_pages_v_blocks_events_items_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_events_items" ADD CONSTRAINT "_pages_v_blocks_events_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_events" ADD CONSTRAINT "_pages_v_blocks_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_startups_benefits" ADD CONSTRAINT "_pages_v_blocks_startups_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_startups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_startups" ADD CONSTRAINT "_pages_v_blocks_startups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX "pages_blocks_sponsors_order_idx" ON "payload"."pages_blocks_sponsors" USING btree ("_order");
  CREATE INDEX "pages_blocks_sponsors_parent_id_idx" ON "payload"."pages_blocks_sponsors" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sponsors_path_idx" ON "payload"."pages_blocks_sponsors" USING btree ("_path");
  CREATE INDEX "pages_blocks_events_items_order_idx" ON "payload"."pages_blocks_events_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_items_parent_id_idx" ON "payload"."pages_blocks_events_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_items_event_idx" ON "payload"."pages_blocks_events_items" USING btree ("event_id");
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
  CREATE INDEX "_pages_v_blocks_sponsors_order_idx" ON "payload"."_pages_v_blocks_sponsors" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sponsors_parent_id_idx" ON "payload"."_pages_v_blocks_sponsors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sponsors_path_idx" ON "payload"."_pages_v_blocks_sponsors" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_events_items_order_idx" ON "payload"."_pages_v_blocks_events_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_items_parent_id_idx" ON "payload"."_pages_v_blocks_events_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_items_event_idx" ON "payload"."_pages_v_blocks_events_items" USING btree ("event_id");
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
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "payload"."_pages_v_blocks_faq" USING btree ("_path");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."pages_blocks_hero_links" CASCADE;
  DROP TABLE "payload"."pages_blocks_hero" CASCADE;
  DROP TABLE "payload"."pages_blocks_about" CASCADE;
  DROP TABLE "payload"."pages_blocks_impact_statistics" CASCADE;
  DROP TABLE "payload"."pages_blocks_impact" CASCADE;
  DROP TABLE "payload"."pages_blocks_mission" CASCADE;
  DROP TABLE "payload"."pages_blocks_sponsors" CASCADE;
  DROP TABLE "payload"."pages_blocks_events_items" CASCADE;
  DROP TABLE "payload"."pages_blocks_events" CASCADE;
  DROP TABLE "payload"."pages_blocks_startups_benefits" CASCADE;
  DROP TABLE "payload"."pages_blocks_startups" CASCADE;
  DROP TABLE "payload"."pages_blocks_faq_items" CASCADE;
  DROP TABLE "payload"."pages_blocks_faq" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_hero_links" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_hero" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_about" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_impact_statistics" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_impact" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_mission" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_sponsors" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_events_items" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_events" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_startups_benefits" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_startups" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_faq" CASCADE;
  ALTER TABLE "payload"."partners" DROP COLUMN "show_on_home";
  ALTER TABLE "payload"."_partners_v" DROP COLUMN "version_show_on_home";
  DROP TYPE "payload"."enum_pages_blocks_events_items_artwork";
  DROP TYPE "payload"."enum__pages_v_blocks_events_items_artwork";`)
}
