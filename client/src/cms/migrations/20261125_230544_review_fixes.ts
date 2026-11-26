import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."events" ADD COLUMN "destination_url" varchar;
  ALTER TABLE "payload"."_events_v" ADD COLUMN "version_destination_url" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."events" DROP COLUMN "destination_url";
  ALTER TABLE "payload"."_events_v" DROP COLUMN "version_destination_url";`)
}
