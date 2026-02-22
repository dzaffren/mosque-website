import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
