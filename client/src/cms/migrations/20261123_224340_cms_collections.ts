import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_template" AS ENUM('home', 'departments', 'sponsors', 'projects', 'blog', 'startups', 'careers', 'events', 'ai2', 'eigenai', 'ml-fundamentals');
  CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__pages_v_version_template" AS ENUM('home', 'departments', 'sponsors', 'projects', 'blog', 'startups', 'careers', 'events', 'ai2', 'eigenai', 'ml-fundamentals');
  CREATE TYPE "payload"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_events_kind" AS ENUM('event', 'workshop', 'program');
  CREATE TYPE "payload"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__events_v_version_kind" AS ENUM('event', 'workshop', 'program');
  CREATE TYPE "payload"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_projects_category" AS ENUM('aiapps', 'cvpr', 'finml', 'genai', 'medai', 'mlhealth', 'mlops', 'mlresearch', 'mlrl', 'nlp', 'supvlr');
  CREATE TYPE "payload"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__projects_v_version_category" AS ENUM('aiapps', 'cvpr', 'finml', 'genai', 'medai', 'mlhealth', 'mlops', 'mlresearch', 'mlrl', 'nlp', 'supvlr');
  CREATE TYPE "payload"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_people_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__people_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_careers_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__careers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_startups_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__startups_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_media_kind" AS ENUM('image', 'document');
  CREATE TYPE "payload"."enum_media_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__media_v_version_kind" AS ENUM('image', 'document');
  CREATE TYPE "payload"."enum__media_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."pages_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar
  );

  CREATE TABLE "payload"."pages_partners" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "partner_id" integer,
    "context" varchar
  );

  CREATE TABLE "payload"."pages_sponsorship_packages_benefits" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "benefit" varchar
  );

  CREATE TABLE "payload"."pages_sponsorship_packages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar,
    "price" numeric
  );

  CREATE TABLE "payload"."pages_people" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "person_id" integer,
    "role" varchar
  );

  CREATE TABLE "payload"."pages" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "template" "payload"."enum_pages_template",
    "introduction_heading" varchar,
    "introduction_description" varchar,
    "metadata_title" varchar,
    "metadata_description" varchar,
    "metadata_image_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."pages_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "events_id" integer,
    "projects_id" integer,
    "posts_id" integer,
    "careers_id" integer,
    "startups_id" integer
  );

  CREATE TABLE "payload"."_pages_v_version_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_pages_v_version_partners" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "partner_id" integer,
    "context" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_pages_v_version_sponsorship_packages_benefits" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "benefit" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_pages_v_version_sponsorship_packages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "price" numeric,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_pages_v_version_people" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "person_id" integer,
    "role" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_pages_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_template" "payload"."enum__pages_v_version_template",
    "version_introduction_heading" varchar,
    "version_introduction_description" varchar,
    "version_metadata_title" varchar,
    "version_metadata_description" varchar,
    "version_metadata_image_id" integer,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__pages_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."_pages_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "events_id" integer,
    "projects_id" integer,
    "posts_id" integer,
    "careers_id" integer,
    "startups_id" integer
  );

  CREATE TABLE "payload"."events_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar
  );

  CREATE TABLE "payload"."events_learning_goals" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "goal" varchar
  );

  CREATE TABLE "payload"."events_resources" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "url" varchar
  );

  CREATE TABLE "payload"."events_speakers" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "person_id" integer,
    "role" varchar
  );

  CREATE TABLE "payload"."events_sponsors" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "partner_id" integer,
    "tier" varchar
  );

  CREATE TABLE "payload"."events_schedule" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "time" varchar,
    "title" varchar,
    "description" varchar
  );

  CREATE TABLE "payload"."events" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "kind" "payload"."enum_events_kind",
    "summary" varchar,
    "starts_at" timestamp(3) with time zone,
    "ends_at" timestamp(3) with time zone,
    "date_label" varchar,
    "venue" varchar,
    "registration_url" varchar,
    "instructor" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_events_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_events_v_version_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_events_v_version_learning_goals" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "goal" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_events_v_version_resources" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "url" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_events_v_version_speakers" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "person_id" integer,
    "role" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_events_v_version_sponsors" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "partner_id" integer,
    "tier" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_events_v_version_schedule" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "time" varchar,
    "title" varchar,
    "description" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_events_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_kind" "payload"."enum__events_v_version_kind",
    "version_summary" varchar,
    "version_starts_at" timestamp(3) with time zone,
    "version_ends_at" timestamp(3) with time zone,
    "version_date_label" varchar,
    "version_venue" varchar,
    "version_registration_url" varchar,
    "version_instructor" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__events_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."projects" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "slug" varchar,
    "description" varchar,
    "category" "payload"."enum_projects_category",
    "image_id" integer,
    "repository_url" varchar,
    "destination_url" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_projects_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_projects_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_slug" varchar,
    "version_description" varchar,
    "version_category" "payload"."enum__projects_v_version_category",
    "version_image_id" integer,
    "version_repository_url" varchar,
    "version_destination_url" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__projects_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."posts" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "author" varchar,
    "published_at" timestamp(3) with time zone,
    "external_url" varchar,
    "image_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_posts_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_posts_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_author" varchar,
    "version_published_at" timestamp(3) with time zone,
    "version_external_url" varchar,
    "version_image_id" integer,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__posts_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."partners" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "slug" varchar,
    "website" varchar,
    "logo_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_partners_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_partners_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_slug" varchar,
    "version_website" varchar,
    "version_logo_id" integer,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__partners_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."people" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "slug" varchar,
    "bio" varchar,
    "photo_id" integer,
    "profile_url" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_people_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_people_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_slug" varchar,
    "version_bio" varchar,
    "version_photo_id" integer,
    "version_profile_url" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__people_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."careers" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "department" varchar,
    "division" varchar,
    "description" varchar,
    "application_url" varchar,
    "opens_at" timestamp(3) with time zone,
    "closes_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_careers_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_careers_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_department" varchar,
    "version_division" varchar,
    "version_description" varchar,
    "version_application_url" varchar,
    "version_opens_at" timestamp(3) with time zone,
    "version_closes_at" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__careers_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."startups" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "slug" varchar,
    "description" varchar,
    "logo_id" integer,
    "website" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_startups_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_startups_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_slug" varchar,
    "version_description" varchar,
    "version_logo_id" integer,
    "version_website" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__startups_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."media" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "kind" "payload"."enum_media_kind",
    "source" varchar,
    "alt_text" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "payload"."enum_media_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_media_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_kind" "payload"."enum__media_v_version_kind",
    "version_source" varchar,
    "version_alt_text" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "payload"."enum__media_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload"."site_settings_navigation" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar
  );

  CREATE TABLE "payload"."site_settings_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar
  );

  CREATE TABLE "payload"."site_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_email" varchar,
    "footer_text" varchar,
    "_status" "payload"."enum_site_settings_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "payload"."_site_settings_v_version_navigation" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_site_settings_v_version_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "payload"."_site_settings_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_contact_email" varchar,
    "version_footer_text" varchar,
    "version__status" "payload"."enum__site_settings_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "careers_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "startups_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "payload"."pages_faq" ADD CONSTRAINT "pages_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_partners" ADD CONSTRAINT "pages_partners_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_partners" ADD CONSTRAINT "pages_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_sponsorship_packages_benefits" ADD CONSTRAINT "pages_sponsorship_packages_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_sponsorship_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_sponsorship_packages" ADD CONSTRAINT "pages_sponsorship_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_people" ADD CONSTRAINT "pages_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "payload"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_people" ADD CONSTRAINT "pages_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages" ADD CONSTRAINT "pages_metadata_image_id_media_id_fk" FOREIGN KEY ("metadata_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_careers_fk" FOREIGN KEY ("careers_id") REFERENCES "payload"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_rels" ADD CONSTRAINT "pages_rels_startups_fk" FOREIGN KEY ("startups_id") REFERENCES "payload"."startups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_version_faq" ADD CONSTRAINT "_pages_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_version_partners" ADD CONSTRAINT "_pages_v_version_partners_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_version_partners" ADD CONSTRAINT "_pages_v_version_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_version_sponsorship_packages_benefits" ADD CONSTRAINT "_pages_v_version_sponsorship_packages_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_version_sponsorship_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_version_sponsorship_packages" ADD CONSTRAINT "_pages_v_version_sponsorship_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_version_people" ADD CONSTRAINT "_pages_v_version_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "payload"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_version_people" ADD CONSTRAINT "_pages_v_version_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_version_metadata_image_id_media_id_fk" FOREIGN KEY ("version_metadata_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_careers_fk" FOREIGN KEY ("careers_id") REFERENCES "payload"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_startups_fk" FOREIGN KEY ("startups_id") REFERENCES "payload"."startups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_tags" ADD CONSTRAINT "events_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_learning_goals" ADD CONSTRAINT "events_learning_goals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_resources" ADD CONSTRAINT "events_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_speakers" ADD CONSTRAINT "events_speakers_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "payload"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events_speakers" ADD CONSTRAINT "events_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_sponsors" ADD CONSTRAINT "events_sponsors_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events_sponsors" ADD CONSTRAINT "events_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events_schedule" ADD CONSTRAINT "events_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_tags" ADD CONSTRAINT "_events_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_learning_goals" ADD CONSTRAINT "_events_v_version_learning_goals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_resources" ADD CONSTRAINT "_events_v_version_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_speakers" ADD CONSTRAINT "_events_v_version_speakers_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "payload"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_speakers" ADD CONSTRAINT "_events_v_version_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_sponsors" ADD CONSTRAINT "_events_v_version_sponsors_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_sponsors" ADD CONSTRAINT "_events_v_version_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_schedule" ADD CONSTRAINT "_events_v_version_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v" ADD CONSTRAINT "_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_people_v" ADD CONSTRAINT "_people_v_parent_id_people_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_people_v" ADD CONSTRAINT "_people_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_careers_v" ADD CONSTRAINT "_careers_v_parent_id_careers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."careers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."startups" ADD CONSTRAINT "startups_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_startups_v" ADD CONSTRAINT "_startups_v_parent_id_startups_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."startups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_startups_v" ADD CONSTRAINT "_startups_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_site_settings_v_version_navigation" ADD CONSTRAINT "_site_settings_v_version_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_site_settings_v_version_social_links" ADD CONSTRAINT "_site_settings_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_faq_order_idx" ON "payload"."pages_faq" USING btree ("_order");
  CREATE INDEX "pages_faq_parent_id_idx" ON "payload"."pages_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_partners_order_idx" ON "payload"."pages_partners" USING btree ("_order");
  CREATE INDEX "pages_partners_parent_id_idx" ON "payload"."pages_partners" USING btree ("_parent_id");
  CREATE INDEX "pages_partners_partner_idx" ON "payload"."pages_partners" USING btree ("partner_id");
  CREATE INDEX "pages_sponsorship_packages_benefits_order_idx" ON "payload"."pages_sponsorship_packages_benefits" USING btree ("_order");
  CREATE INDEX "pages_sponsorship_packages_benefits_parent_id_idx" ON "payload"."pages_sponsorship_packages_benefits" USING btree ("_parent_id");
  CREATE INDEX "pages_sponsorship_packages_order_idx" ON "payload"."pages_sponsorship_packages" USING btree ("_order");
  CREATE INDEX "pages_sponsorship_packages_parent_id_idx" ON "payload"."pages_sponsorship_packages" USING btree ("_parent_id");
  CREATE INDEX "pages_people_order_idx" ON "payload"."pages_people" USING btree ("_order");
  CREATE INDEX "pages_people_parent_id_idx" ON "payload"."pages_people" USING btree ("_parent_id");
  CREATE INDEX "pages_people_person_idx" ON "payload"."pages_people" USING btree ("person_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE UNIQUE INDEX "pages_template_idx" ON "payload"."pages" USING btree ("template");
  CREATE INDEX "pages_metadata_metadata_image_idx" ON "payload"."pages" USING btree ("metadata_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "payload"."pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "payload"."pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "payload"."pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "payload"."pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_events_id_idx" ON "payload"."pages_rels" USING btree ("events_id");
  CREATE INDEX "pages_rels_projects_id_idx" ON "payload"."pages_rels" USING btree ("projects_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "payload"."pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_careers_id_idx" ON "payload"."pages_rels" USING btree ("careers_id");
  CREATE INDEX "pages_rels_startups_id_idx" ON "payload"."pages_rels" USING btree ("startups_id");
  CREATE INDEX "_pages_v_version_faq_order_idx" ON "payload"."_pages_v_version_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_version_faq_parent_id_idx" ON "payload"."_pages_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_partners_order_idx" ON "payload"."_pages_v_version_partners" USING btree ("_order");
  CREATE INDEX "_pages_v_version_partners_parent_id_idx" ON "payload"."_pages_v_version_partners" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_partners_partner_idx" ON "payload"."_pages_v_version_partners" USING btree ("partner_id");
  CREATE INDEX "_pages_v_version_sponsorship_packages_benefits_order_idx" ON "payload"."_pages_v_version_sponsorship_packages_benefits" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sponsorship_packages_benefits_parent_id_idx" ON "payload"."_pages_v_version_sponsorship_packages_benefits" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sponsorship_packages_order_idx" ON "payload"."_pages_v_version_sponsorship_packages" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sponsorship_packages_parent_id_idx" ON "payload"."_pages_v_version_sponsorship_packages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_people_order_idx" ON "payload"."_pages_v_version_people" USING btree ("_order");
  CREATE INDEX "_pages_v_version_people_parent_id_idx" ON "payload"."_pages_v_version_people" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_people_person_idx" ON "payload"."_pages_v_version_people" USING btree ("person_id");
  CREATE INDEX "_pages_v_parent_idx" ON "payload"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "payload"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_template_idx" ON "payload"."_pages_v" USING btree ("version_template");
  CREATE INDEX "_pages_v_version_metadata_version_metadata_image_idx" ON "payload"."_pages_v" USING btree ("version_metadata_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "payload"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "payload"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "payload"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "payload"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "payload"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "payload"."_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_rels_order_idx" ON "payload"."_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "payload"."_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "payload"."_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_events_id_idx" ON "payload"."_pages_v_rels" USING btree ("events_id");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "payload"."_pages_v_rels" USING btree ("projects_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "payload"."_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_careers_id_idx" ON "payload"."_pages_v_rels" USING btree ("careers_id");
  CREATE INDEX "_pages_v_rels_startups_id_idx" ON "payload"."_pages_v_rels" USING btree ("startups_id");
  CREATE INDEX "events_tags_order_idx" ON "payload"."events_tags" USING btree ("_order");
  CREATE INDEX "events_tags_parent_id_idx" ON "payload"."events_tags" USING btree ("_parent_id");
  CREATE INDEX "events_learning_goals_order_idx" ON "payload"."events_learning_goals" USING btree ("_order");
  CREATE INDEX "events_learning_goals_parent_id_idx" ON "payload"."events_learning_goals" USING btree ("_parent_id");
  CREATE INDEX "events_resources_order_idx" ON "payload"."events_resources" USING btree ("_order");
  CREATE INDEX "events_resources_parent_id_idx" ON "payload"."events_resources" USING btree ("_parent_id");
  CREATE INDEX "events_speakers_order_idx" ON "payload"."events_speakers" USING btree ("_order");
  CREATE INDEX "events_speakers_parent_id_idx" ON "payload"."events_speakers" USING btree ("_parent_id");
  CREATE INDEX "events_speakers_person_idx" ON "payload"."events_speakers" USING btree ("person_id");
  CREATE INDEX "events_sponsors_order_idx" ON "payload"."events_sponsors" USING btree ("_order");
  CREATE INDEX "events_sponsors_parent_id_idx" ON "payload"."events_sponsors" USING btree ("_parent_id");
  CREATE INDEX "events_sponsors_partner_idx" ON "payload"."events_sponsors" USING btree ("partner_id");
  CREATE INDEX "events_schedule_order_idx" ON "payload"."events_schedule" USING btree ("_order");
  CREATE INDEX "events_schedule_parent_id_idx" ON "payload"."events_schedule" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "payload"."events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "payload"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "payload"."events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "payload"."events" USING btree ("_status");
  CREATE INDEX "_events_v_version_tags_order_idx" ON "payload"."_events_v_version_tags" USING btree ("_order");
  CREATE INDEX "_events_v_version_tags_parent_id_idx" ON "payload"."_events_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_learning_goals_order_idx" ON "payload"."_events_v_version_learning_goals" USING btree ("_order");
  CREATE INDEX "_events_v_version_learning_goals_parent_id_idx" ON "payload"."_events_v_version_learning_goals" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_resources_order_idx" ON "payload"."_events_v_version_resources" USING btree ("_order");
  CREATE INDEX "_events_v_version_resources_parent_id_idx" ON "payload"."_events_v_version_resources" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_speakers_order_idx" ON "payload"."_events_v_version_speakers" USING btree ("_order");
  CREATE INDEX "_events_v_version_speakers_parent_id_idx" ON "payload"."_events_v_version_speakers" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_speakers_person_idx" ON "payload"."_events_v_version_speakers" USING btree ("person_id");
  CREATE INDEX "_events_v_version_sponsors_order_idx" ON "payload"."_events_v_version_sponsors" USING btree ("_order");
  CREATE INDEX "_events_v_version_sponsors_parent_id_idx" ON "payload"."_events_v_version_sponsors" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_sponsors_partner_idx" ON "payload"."_events_v_version_sponsors" USING btree ("partner_id");
  CREATE INDEX "_events_v_version_schedule_order_idx" ON "payload"."_events_v_version_schedule" USING btree ("_order");
  CREATE INDEX "_events_v_version_schedule_parent_id_idx" ON "payload"."_events_v_version_schedule" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "payload"."_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "payload"."_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "payload"."_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "payload"."_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "payload"."_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "payload"."_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "payload"."_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "payload"."_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "payload"."projects" USING btree ("slug");
  CREATE INDEX "projects_image_idx" ON "payload"."projects" USING btree ("image_id");
  CREATE INDEX "projects_updated_at_idx" ON "payload"."projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "payload"."projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "payload"."projects" USING btree ("_status");
  CREATE INDEX "_projects_v_parent_idx" ON "payload"."_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "payload"."_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_image_idx" ON "payload"."_projects_v" USING btree ("version_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "payload"."_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "payload"."_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "payload"."_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "payload"."_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "payload"."_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "payload"."_projects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "payload"."posts" USING btree ("slug");
  CREATE UNIQUE INDEX "posts_external_url_idx" ON "payload"."posts" USING btree ("external_url");
  CREATE INDEX "posts_image_idx" ON "payload"."posts" USING btree ("image_id");
  CREATE INDEX "posts_updated_at_idx" ON "payload"."posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "payload"."posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "payload"."posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "payload"."_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "payload"."_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_external_url_idx" ON "payload"."_posts_v" USING btree ("version_external_url");
  CREATE INDEX "_posts_v_version_version_image_idx" ON "payload"."_posts_v" USING btree ("version_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "payload"."_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "payload"."_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "payload"."_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "payload"."_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "payload"."_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "payload"."_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "partners_slug_idx" ON "payload"."partners" USING btree ("slug");
  CREATE INDEX "partners_logo_idx" ON "payload"."partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "payload"."partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "payload"."partners" USING btree ("created_at");
  CREATE INDEX "partners__status_idx" ON "payload"."partners" USING btree ("_status");
  CREATE INDEX "_partners_v_parent_idx" ON "payload"."_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_slug_idx" ON "payload"."_partners_v" USING btree ("version_slug");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "payload"."_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "payload"."_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "payload"."_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "payload"."_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "payload"."_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "payload"."_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_latest_idx" ON "payload"."_partners_v" USING btree ("latest");
  CREATE UNIQUE INDEX "people_slug_idx" ON "payload"."people" USING btree ("slug");
  CREATE INDEX "people_photo_idx" ON "payload"."people" USING btree ("photo_id");
  CREATE INDEX "people_updated_at_idx" ON "payload"."people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "payload"."people" USING btree ("created_at");
  CREATE INDEX "people__status_idx" ON "payload"."people" USING btree ("_status");
  CREATE INDEX "_people_v_parent_idx" ON "payload"."_people_v" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_version_slug_idx" ON "payload"."_people_v" USING btree ("version_slug");
  CREATE INDEX "_people_v_version_version_photo_idx" ON "payload"."_people_v" USING btree ("version_photo_id");
  CREATE INDEX "_people_v_version_version_updated_at_idx" ON "payload"."_people_v" USING btree ("version_updated_at");
  CREATE INDEX "_people_v_version_version_created_at_idx" ON "payload"."_people_v" USING btree ("version_created_at");
  CREATE INDEX "_people_v_version_version__status_idx" ON "payload"."_people_v" USING btree ("version__status");
  CREATE INDEX "_people_v_created_at_idx" ON "payload"."_people_v" USING btree ("created_at");
  CREATE INDEX "_people_v_updated_at_idx" ON "payload"."_people_v" USING btree ("updated_at");
  CREATE INDEX "_people_v_latest_idx" ON "payload"."_people_v" USING btree ("latest");
  CREATE UNIQUE INDEX "careers_slug_idx" ON "payload"."careers" USING btree ("slug");
  CREATE INDEX "careers_updated_at_idx" ON "payload"."careers" USING btree ("updated_at");
  CREATE INDEX "careers_created_at_idx" ON "payload"."careers" USING btree ("created_at");
  CREATE INDEX "careers__status_idx" ON "payload"."careers" USING btree ("_status");
  CREATE INDEX "_careers_v_parent_idx" ON "payload"."_careers_v" USING btree ("parent_id");
  CREATE INDEX "_careers_v_version_version_slug_idx" ON "payload"."_careers_v" USING btree ("version_slug");
  CREATE INDEX "_careers_v_version_version_updated_at_idx" ON "payload"."_careers_v" USING btree ("version_updated_at");
  CREATE INDEX "_careers_v_version_version_created_at_idx" ON "payload"."_careers_v" USING btree ("version_created_at");
  CREATE INDEX "_careers_v_version_version__status_idx" ON "payload"."_careers_v" USING btree ("version__status");
  CREATE INDEX "_careers_v_created_at_idx" ON "payload"."_careers_v" USING btree ("created_at");
  CREATE INDEX "_careers_v_updated_at_idx" ON "payload"."_careers_v" USING btree ("updated_at");
  CREATE INDEX "_careers_v_latest_idx" ON "payload"."_careers_v" USING btree ("latest");
  CREATE UNIQUE INDEX "startups_slug_idx" ON "payload"."startups" USING btree ("slug");
  CREATE INDEX "startups_logo_idx" ON "payload"."startups" USING btree ("logo_id");
  CREATE INDEX "startups_updated_at_idx" ON "payload"."startups" USING btree ("updated_at");
  CREATE INDEX "startups_created_at_idx" ON "payload"."startups" USING btree ("created_at");
  CREATE INDEX "startups__status_idx" ON "payload"."startups" USING btree ("_status");
  CREATE INDEX "_startups_v_parent_idx" ON "payload"."_startups_v" USING btree ("parent_id");
  CREATE INDEX "_startups_v_version_version_slug_idx" ON "payload"."_startups_v" USING btree ("version_slug");
  CREATE INDEX "_startups_v_version_version_logo_idx" ON "payload"."_startups_v" USING btree ("version_logo_id");
  CREATE INDEX "_startups_v_version_version_updated_at_idx" ON "payload"."_startups_v" USING btree ("version_updated_at");
  CREATE INDEX "_startups_v_version_version_created_at_idx" ON "payload"."_startups_v" USING btree ("version_created_at");
  CREATE INDEX "_startups_v_version_version__status_idx" ON "payload"."_startups_v" USING btree ("version__status");
  CREATE INDEX "_startups_v_created_at_idx" ON "payload"."_startups_v" USING btree ("created_at");
  CREATE INDEX "_startups_v_updated_at_idx" ON "payload"."_startups_v" USING btree ("updated_at");
  CREATE INDEX "_startups_v_latest_idx" ON "payload"."_startups_v" USING btree ("latest");
  CREATE UNIQUE INDEX "media_source_idx" ON "payload"."media" USING btree ("source");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE INDEX "media__status_idx" ON "payload"."media" USING btree ("_status");
  CREATE INDEX "_media_v_parent_idx" ON "payload"."_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version_source_idx" ON "payload"."_media_v" USING btree ("version_source");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "payload"."_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "payload"."_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version__status_idx" ON "payload"."_media_v" USING btree ("version__status");
  CREATE INDEX "_media_v_created_at_idx" ON "payload"."_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "payload"."_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_latest_idx" ON "payload"."_media_v" USING btree ("latest");
  CREATE INDEX "site_settings_navigation_order_idx" ON "payload"."site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "payload"."site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "payload"."site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "payload"."site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings__status_idx" ON "payload"."site_settings" USING btree ("_status");
  CREATE INDEX "_site_settings_v_version_navigation_order_idx" ON "payload"."_site_settings_v_version_navigation" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_navigation_parent_id_idx" ON "payload"."_site_settings_v_version_navigation" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_social_links_order_idx" ON "payload"."_site_settings_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_social_links_parent_id_idx" ON "payload"."_site_settings_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "payload"."_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "payload"."_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "payload"."_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_latest_idx" ON "payload"."_site_settings_v" USING btree ("latest");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "payload"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "payload"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_careers_fk" FOREIGN KEY ("careers_id") REFERENCES "payload"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_startups_fk" FOREIGN KEY ("startups_id") REFERENCES "payload"."startups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_careers_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("careers_id");
  CREATE INDEX "payload_locked_documents_rels_startups_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("startups_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."pages_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_sponsorship_packages_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_sponsorship_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_version_partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_version_sponsorship_packages_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_version_sponsorship_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_version_people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_learning_goals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_speakers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_schedule" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v_version_learning_goals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v_version_resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v_version_speakers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v_version_sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v_version_schedule" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_partners_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_people_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."careers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_careers_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."startups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_startups_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_media_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."site_settings_navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."site_settings_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_site_settings_v_version_navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_site_settings_v_version_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_site_settings_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."pages_faq" CASCADE;
  DROP TABLE "payload"."pages_partners" CASCADE;
  DROP TABLE "payload"."pages_sponsorship_packages_benefits" CASCADE;
  DROP TABLE "payload"."pages_sponsorship_packages" CASCADE;
  DROP TABLE "payload"."pages_people" CASCADE;
  DROP TABLE "payload"."pages" CASCADE;
  DROP TABLE "payload"."pages_rels" CASCADE;
  DROP TABLE "payload"."_pages_v_version_faq" CASCADE;
  DROP TABLE "payload"."_pages_v_version_partners" CASCADE;
  DROP TABLE "payload"."_pages_v_version_sponsorship_packages_benefits" CASCADE;
  DROP TABLE "payload"."_pages_v_version_sponsorship_packages" CASCADE;
  DROP TABLE "payload"."_pages_v_version_people" CASCADE;
  DROP TABLE "payload"."_pages_v" CASCADE;
  DROP TABLE "payload"."_pages_v_rels" CASCADE;
  DROP TABLE "payload"."events_tags" CASCADE;
  DROP TABLE "payload"."events_learning_goals" CASCADE;
  DROP TABLE "payload"."events_resources" CASCADE;
  DROP TABLE "payload"."events_speakers" CASCADE;
  DROP TABLE "payload"."events_sponsors" CASCADE;
  DROP TABLE "payload"."events_schedule" CASCADE;
  DROP TABLE "payload"."events" CASCADE;
  DROP TABLE "payload"."_events_v_version_tags" CASCADE;
  DROP TABLE "payload"."_events_v_version_learning_goals" CASCADE;
  DROP TABLE "payload"."_events_v_version_resources" CASCADE;
  DROP TABLE "payload"."_events_v_version_speakers" CASCADE;
  DROP TABLE "payload"."_events_v_version_sponsors" CASCADE;
  DROP TABLE "payload"."_events_v_version_schedule" CASCADE;
  DROP TABLE "payload"."_events_v" CASCADE;
  DROP TABLE "payload"."projects" CASCADE;
  DROP TABLE "payload"."_projects_v" CASCADE;
  DROP TABLE "payload"."posts" CASCADE;
  DROP TABLE "payload"."_posts_v" CASCADE;
  DROP TABLE "payload"."partners" CASCADE;
  DROP TABLE "payload"."_partners_v" CASCADE;
  DROP TABLE "payload"."people" CASCADE;
  DROP TABLE "payload"."_people_v" CASCADE;
  DROP TABLE "payload"."careers" CASCADE;
  DROP TABLE "payload"."_careers_v" CASCADE;
  DROP TABLE "payload"."startups" CASCADE;
  DROP TABLE "payload"."_startups_v" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."_media_v" CASCADE;
  DROP TABLE "payload"."site_settings_navigation" CASCADE;
  DROP TABLE "payload"."site_settings_social_links" CASCADE;
  DROP TABLE "payload"."site_settings" CASCADE;
  DROP TABLE "payload"."_site_settings_v_version_navigation" CASCADE;
  DROP TABLE "payload"."_site_settings_v_version_social_links" CASCADE;
  DROP TABLE "payload"."_site_settings_v" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_people_fk";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_careers_fk";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_startups_fk";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_fk";

  DROP INDEX "payload"."payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_events_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_partners_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_people_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_careers_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_startups_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_media_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "partners_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "people_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "careers_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "startups_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "media_id";
  DROP TYPE "payload"."enum_pages_template";
  DROP TYPE "payload"."enum_pages_status";
  DROP TYPE "payload"."enum__pages_v_version_template";
  DROP TYPE "payload"."enum__pages_v_version_status";
  DROP TYPE "payload"."enum_events_kind";
  DROP TYPE "payload"."enum_events_status";
  DROP TYPE "payload"."enum__events_v_version_kind";
  DROP TYPE "payload"."enum__events_v_version_status";
  DROP TYPE "payload"."enum_projects_category";
  DROP TYPE "payload"."enum_projects_status";
  DROP TYPE "payload"."enum__projects_v_version_category";
  DROP TYPE "payload"."enum__projects_v_version_status";
  DROP TYPE "payload"."enum_posts_status";
  DROP TYPE "payload"."enum__posts_v_version_status";
  DROP TYPE "payload"."enum_partners_status";
  DROP TYPE "payload"."enum__partners_v_version_status";
  DROP TYPE "payload"."enum_people_status";
  DROP TYPE "payload"."enum__people_v_version_status";
  DROP TYPE "payload"."enum_careers_status";
  DROP TYPE "payload"."enum__careers_v_version_status";
  DROP TYPE "payload"."enum_startups_status";
  DROP TYPE "payload"."enum__startups_v_version_status";
  DROP TYPE "payload"."enum_media_kind";
  DROP TYPE "payload"."enum_media_status";
  DROP TYPE "payload"."enum__media_v_version_kind";
  DROP TYPE "payload"."enum__media_v_version_status";
  DROP TYPE "payload"."enum_site_settings_status";
  DROP TYPE "payload"."enum__site_settings_v_version_status";`)
}
