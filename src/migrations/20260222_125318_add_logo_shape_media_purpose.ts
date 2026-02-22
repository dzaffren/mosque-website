import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- Add logoShape enum and column to mosque_settings
   CREATE TYPE "public"."enum_mosque_settings_logo_shape" AS ENUM('square', 'circle');
   ALTER TABLE "mosque_settings" ADD COLUMN "logo_shape" "enum_mosque_settings_logo_shape" DEFAULT 'square';
   
   -- Add purpose enum and column to media
   CREATE TYPE "public"."enum_media_purpose" AS ENUM('logo', 'gallery', 'event', 'staff', 'other');
   ALTER TABLE "media" ADD COLUMN "purpose" "enum_media_purpose" DEFAULT 'other';
   
   -- Add image sizes columns to media (thumbnail and card)
   ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
   ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
   ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
   ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
   ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
   ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
   
   ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
   ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
   ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
   ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
   ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
   ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- Remove columns and enums
   ALTER TABLE "mosque_settings" DROP COLUMN "logo_shape";
   DROP TYPE "public"."enum_mosque_settings_logo_shape";
   
   ALTER TABLE "media" DROP COLUMN "purpose";
   DROP TYPE "public"."enum_media_purpose";
   
   -- Remove image sizes columns
   ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
   ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
   ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
   ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
   ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
   ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
   
   ALTER TABLE "media" DROP COLUMN "sizes_card_url";
   ALTER TABLE "media" DROP COLUMN "sizes_card_width";
   ALTER TABLE "media" DROP COLUMN "sizes_card_height";
   ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
   ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
   ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  `)
}
