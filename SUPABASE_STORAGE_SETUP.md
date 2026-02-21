# Supabase Storage Setup Guide

## What was configured

Your mosque-website project is now configured to use Supabase Storage for persistent file uploads in production (Vercel). Files are automatically uploaded to Supabase when created/updated, and deleted from Supabase when removed from the CMS.

## Setup Steps

### 1. Create Supabase Storage Bucket

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **Storage** → **Buckets**
3. Create a new bucket named `media`
4. Set it to **Public** (so files can be accessed via public URL)
5. Optional: Configure CORS if needed

### 2. Get Your Credentials

From your Supabase project settings:

1. **Project URL**: Settings → API → Project URL
   - Example: `https://xxxxx.supabase.co`
   - Add to: `SUPABASE_URL`

2. **API Keys**: Settings → API → Project API keys
   - **Publishable Key** (Anon) → `SUPABASE_ANON_KEY`
   - **Secret Key** (Service Role) → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

### 3. Environment Variables

Add to your Vercel deployment:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

For local development, add to `.env.local`:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4. How It Works

- **Local (development)**: Files stored in `./media`
- **Production (Vercel)**: 
  - Uploaded to `/tmp/media` temporarily during request
  - Automatically synced to Supabase Storage
  - Public URL returned for access
  - Deleted from Supabase when removed from CMS

### 5. File Organization

Files are stored in Supabase with this structure:
```
media/
├── 2026/
│   ├── 02/
│   │   ├── id-filename.jpg
│   │   └── id-filename.png
```

Each file is named with its document ID and original filename for uniqueness.

## Troubleshooting

**Files not uploading to Supabase?**
- Check that `SUPABASE_URL` and keys are set correctly
- Verify the `media` bucket exists and is public
- Check server logs for errors

**Missing files after deployment?**
- This is expected - `/tmp` is ephemeral on Vercel
- Re-upload the file and it will be saved to Supabase

**Files not accessible?**
- Make sure the `media` bucket is set to **Public**
- Check CORS settings if needed

## Next Steps

Consider adding:
- Image optimization/resizing on upload
- Virus scanning for uploads
- File type restrictions
- Upload size limits in collection config
