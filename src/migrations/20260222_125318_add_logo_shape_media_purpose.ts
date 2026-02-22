import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- Add logoShape enum and column to mosque_settings
   CREATE TYPE "public"."enum_mosque_settings_logo_shape" AS ENUM('square', 'circle');
   ALTER TABLE "mosque_settings" ADD COLUMN "logo_shape" "enum_mosque_settings_logo_shape" DEFAULT 'square';
   
   -- Add purpose enum and column to media
   CREATE TYPE "public"."enum_media_purpose" AS ENUM('logo', 'gallery', 'event', 'staff', 'other');
   ALTER TABLE "media" ADD COLUMN "purpose" "enum_media_purpose" DEFAULT 'other';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- Remove columns and enums
   ALTER TABLE "mosque_settings" DROP COLUMN "logo_shape";
   DROP TYPE "public"."enum_mosque_settings_logo_shape";
   
   ALTER TABLE "media" DROP COLUMN "purpose";
   DROP TYPE "public"."enum_media_purpose";
  `)
}
