# URGENT: Database Migration Required

## Problem
The production deployment is failing with this error:
```
error: column "logo_shape" does not exist
error: column "purpose" does not exist
```

This is because we added new fields to the schema but **the database migration hasn't run yet**.

## Root Cause
Your Vercel deployment **cannot connect to Supabase** because the `DATABASE_URL` is using the wrong connection format. See `DEPLOYMENT.md` for details.

## Fix Required (2 Steps)

### Step 1: Fix Supabase Connection URL ⚠️ CRITICAL

You MUST update your `DATABASE_URL` on Vercel to use the **Supabase Connection Pooler**:

1. Go to **Supabase Dashboard** → Your Project → **Settings** → **Database**
2. Under **Connection string**, select **Transaction** mode (NOT Session mode)
3. Copy the URL - it should look like:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   Note: Port must be **6543** (pooler), NOT 5432 (direct connection)

4. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
5. Update `DATABASE_URL` with the pooler URL
6. **Redeploy** the project

### Step 2: Run Migration (After Connection Fix)

Once the connection works, the migration will run automatically on deploy. You can verify by checking the build logs for:
```
[INFO]: Running migration: 20260222_125318_add_logo_shape_media_purpose
```

## Alternative: Run Migration Manually

If you want to run the migration manually before deploying:

```bash
# Connect to your Supabase database
psql "postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"

# Run this SQL:
CREATE TYPE "public"."enum_mosque_settings_logo_shape" AS ENUM('square', 'circle');
ALTER TABLE "mosque_settings" ADD COLUMN "logo_shape" "enum_mosque_settings_logo_shape" DEFAULT 'square';

CREATE TYPE "public"."enum_media_purpose" AS ENUM('logo', 'gallery', 'event', 'staff', 'other');
ALTER TABLE "media" ADD COLUMN "purpose" "enum_media_purpose" DEFAULT 'other';
```

## What the Migration Does

Adds two new columns:
- `mosque_settings.logo_shape` - Controls circular vs square logo display
- `media.purpose` - Categorizes uploaded images (logo, gallery, event, etc.)

## Verify Migration Success

After the migration runs, check your Vercel logs. You should see:
- ✅ No more "column does not exist" errors
- ✅ Website loads successfully
- ✅ Logo displays in navbar

## Still Having Issues?

If the connection still times out after updating `DATABASE_URL`:

1. **Check Supabase project status**: Free tier projects pause after 7 days of inactivity
2. **Verify pooler is enabled**: Supabase Dashboard → Database → Connection Pooling
3. **Check firewall**: Ensure Supabase allows connections from Vercel IPs

See `DEPLOYMENT.md` for complete troubleshooting guide.
