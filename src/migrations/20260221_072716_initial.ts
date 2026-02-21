import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`prayer_times\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`fajr\` text DEFAULT '5:30 AM' NOT NULL,
  	\`dhuhr\` text DEFAULT '1:00 PM' NOT NULL,
  	\`asr\` text DEFAULT '4:30 PM' NOT NULL,
  	\`maghrib\` text DEFAULT '7:15 PM' NOT NULL,
  	\`isha\` text DEFAULT '8:30 PM' NOT NULL,
  	\`jumuah\` text DEFAULT '1:00 PM',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`prayer_times_date_idx\` ON \`prayer_times\` (\`date\`);`)
  await db.run(sql`CREATE INDEX \`prayer_times_updated_at_idx\` ON \`prayer_times\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`prayer_times_created_at_idx\` ON \`prayer_times\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`date\` text NOT NULL,
  	\`end_date\` text,
  	\`location\` text,
  	\`image_id\` integer,
  	\`featured\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`events_image_idx\` ON \`events\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`announcements\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`body\` text,
  	\`date\` text NOT NULL,
  	\`priority\` text DEFAULT 'normal',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`announcements_updated_at_idx\` ON \`announcements\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`announcements_created_at_idx\` ON \`announcements\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`gallery\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`caption\` text,
  	\`category\` text DEFAULT 'general',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`gallery_image_idx\` ON \`gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_updated_at_idx\` ON \`gallery\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_created_at_idx\` ON \`gallery\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`staff\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`bio\` text,
  	\`photo_id\` integer,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`staff_photo_idx\` ON \`staff\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`staff_updated_at_idx\` ON \`staff\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`staff_created_at_idx\` ON \`staff\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`khutbah_schedule\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`topic\` text NOT NULL,
  	\`speaker\` text NOT NULL,
  	\`notes\` text,
  	\`sermon_pdf_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`khutbah_schedule_updated_at_idx\` ON \`khutbah_schedule\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`khutbah_schedule_created_at_idx\` ON \`khutbah_schedule\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`prayer_roster\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`fajr_imam\` text,
  	\`fajr_bilal\` text,
  	\`dhuhr_imam\` text,
  	\`dhuhr_bilal\` text,
  	\`asr_imam\` text,
  	\`asr_bilal\` text,
  	\`maghrib_imam\` text,
  	\`maghrib_bilal\` text,
  	\`isha_imam\` text,
  	\`isha_bilal\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`prayer_roster_date_idx\` ON \`prayer_roster\` (\`date\`);`)
  await db.run(sql`CREATE INDEX \`prayer_roster_updated_at_idx\` ON \`prayer_roster\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`prayer_roster_created_at_idx\` ON \`prayer_roster\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`donations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`amount\` numeric NOT NULL,
  	\`bill_code\` text,
  	\`status\` text DEFAULT 'pending',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`donations_updated_at_idx\` ON \`donations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`donations_created_at_idx\` ON \`donations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`pledges\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`monthly_amount\` numeric NOT NULL,
  	\`status\` text DEFAULT 'active',
  	\`next_bill_date\` text,
  	\`last_bill_code\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`pledges_updated_at_idx\` ON \`pledges\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pledges_created_at_idx\` ON \`pledges\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`contact_messages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text,
  	\`subject\` text,
  	\`message\` text NOT NULL,
  	\`rating\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_messages_updated_at_idx\` ON \`contact_messages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`contact_messages_created_at_idx\` ON \`contact_messages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`prayer_times_id\` integer,
  	\`events_id\` integer,
  	\`announcements_id\` integer,
  	\`gallery_id\` integer,
  	\`staff_id\` integer,
  	\`khutbah_schedule_id\` integer,
  	\`prayer_roster_id\` integer,
  	\`donations_id\` integer,
  	\`pledges_id\` integer,
  	\`contact_messages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`prayer_times_id\`) REFERENCES \`prayer_times\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`announcements_id\`) REFERENCES \`announcements\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`gallery_id\`) REFERENCES \`gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`staff_id\`) REFERENCES \`staff\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`khutbah_schedule_id\`) REFERENCES \`khutbah_schedule\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`prayer_roster_id\`) REFERENCES \`prayer_roster\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`donations_id\`) REFERENCES \`donations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pledges_id\`) REFERENCES \`pledges\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contact_messages_id\`) REFERENCES \`contact_messages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_prayer_times_id_idx\` ON \`payload_locked_documents_rels\` (\`prayer_times_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_announcements_id_idx\` ON \`payload_locked_documents_rels\` (\`announcements_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_gallery_id_idx\` ON \`payload_locked_documents_rels\` (\`gallery_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_staff_id_idx\` ON \`payload_locked_documents_rels\` (\`staff_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_khutbah_schedule_id_idx\` ON \`payload_locked_documents_rels\` (\`khutbah_schedule_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_prayer_roster_id_idx\` ON \`payload_locked_documents_rels\` (\`prayer_roster_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_donations_id_idx\` ON \`payload_locked_documents_rels\` (\`donations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pledges_id_idx\` ON \`payload_locked_documents_rels\` (\`pledges_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contact_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`contact_messages_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`mosque_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`whatsapp_group_url\` text,
  	\`name\` text DEFAULT 'Masjid Al-Iman' NOT NULL,
  	\`tagline\` text DEFAULT 'A place of worship, community, and learning',
  	\`logo_id\` integer,
  	\`address\` text,
  	\`phone\` text,
  	\`email\` text,
  	\`map_coordinates_lat\` numeric DEFAULT 3.139,
  	\`map_coordinates_lng\` numeric DEFAULT 101.6869,
  	\`social_links_facebook\` text,
  	\`social_links_instagram\` text,
  	\`social_links_youtube\` text,
  	\`social_links_twitter\` text,
  	\`about_history\` text,
  	\`about_mission\` text,
  	\`donation_bank_name\` text,
  	\`donation_account_name\` text,
  	\`donation_account_number\` text,
  	\`donation_description\` text,
  	\`donation_payment_link\` text,
  	\`donation_qr_image_id\` integer,
  	\`jumuah_time\` text DEFAULT '1:00 PM',
  	\`jumuah_guidelines\` text,
  	\`sermon_portal_name\` text DEFAULT 'e-Khutbah JAIS',
  	\`sermon_portal_url\` text DEFAULT 'https://e-khutbah.jais.gov.my/senarai-khutbah-jumaat/',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`donation_qr_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`mosque_settings_logo_idx\` ON \`mosque_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`mosque_settings_donation_donation_qr_image_idx\` ON \`mosque_settings\` (\`donation_qr_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`prayer_times\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`DROP TABLE \`announcements\`;`)
  await db.run(sql`DROP TABLE \`gallery\`;`)
  await db.run(sql`DROP TABLE \`staff\`;`)
  await db.run(sql`DROP TABLE \`khutbah_schedule\`;`)
  await db.run(sql`DROP TABLE \`prayer_roster\`;`)
  await db.run(sql`DROP TABLE \`donations\`;`)
  await db.run(sql`DROP TABLE \`pledges\`;`)
  await db.run(sql`DROP TABLE \`contact_messages\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`mosque_settings\`;`)
}
