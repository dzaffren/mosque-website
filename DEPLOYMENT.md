# Deployment Guide

## Local Development (SQLite)

### Quick Start
```bash
npm install
npm run dev
```

Open http://localhost:3000  
Admin: http://localhost:3000/admin (admin@mosque.com / changeme123)

### Docker
```bash
docker-compose up
```

Database persists in `mosque.db` (mounted as volume).

---

## Production Deployment

### 1. Database Setup (Supabase)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database** → **Connection string**
4. Select **Transaction** mode (required for serverless/Vercel)
5. Copy the connection string:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   ⚠️ **Important:** Use port `6543` (pooler), NOT `5432` (direct). Direct connections will timeout on Vercel.

### 2. Environment Variables

Create `.env.production`:
```bash
# Database (Supabase - use Transaction pooler URL, port 6543)
DATABASE_URL=postgresql://postgres.[project-ref]:YOUR_PASSWORD@aws-0-[region].pooler.supabase.com:6543/postgres
PAYLOAD_SECRET=generate-a-long-random-string-here

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production

# Payments (TayyibPay)
TOYYIBPAY_SECRET_KEY=your-key
TOYYIBPAY_CATEGORY_CODE=your-code
TOYYIBPAY_BASE_URL=https://toyyibpay.com

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL_TO=admin@your-mosque.com

# Cron Jobs
CRON_SECRET=generate-random-secret-here
```

### 3. Deploy to Vercel (Recommended)

**Step 1:** Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/mosque-website.git
git push -u origin main
```

**Step 2:** Deploy on Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import from GitHub
4. Add environment variables from above
5. Click **Deploy**

Vercel automatically handles:
- ✅ Next.js build optimization
- ✅ Cron jobs (via `vercel.json`)
- ✅ SSL/HTTPS
- ✅ Edge caching

### 4. Deploy with Docker

**Build:**
```bash
docker build -t mosque-website:latest .
```

**Run:**
```bash
docker run \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e PAYLOAD_SECRET=... \
  -e SMTP_HOST=... \
  mosque-website:latest
```

**Docker Compose (with environment file):**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Deploy to Other Platforms

#### AWS (ECS/Fargate)
```bash
# Build & push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_ECR_URL
docker tag mosque-website:latest YOUR_ECR_URL/mosque-website:latest
docker push YOUR_ECR_URL/mosque-website:latest

# Create ECS task definition with env vars
# Set Database URL, PAYLOAD_SECRET, etc.
```

#### Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/mosque-website
gcloud run deploy mosque-website \
  --image gcr.io/YOUR_PROJECT/mosque-website \
  --set-env-vars DATABASE_URL=postgresql://... \
  --port 3000
```

#### Railway.app
1. Connect GitHub repository
2. Add Supabase PostgreSQL plugin
3. Set environment variables
4. Deploy

#### Docker Hub / Self-Hosted
```bash
docker build -t yourusername/mosque-website:latest .
docker push yourusername/mosque-website:latest

# On your server:
docker pull yourusername/mosque-website:latest
docker run -d -p 80:3000 \
  -e DATABASE_URL=postgresql://... \
  yourusername/mosque-website:latest
```

---

## Database Migrations

When you update the Payload schema (add/remove collections/fields):

### Local (SQLite)
```bash
npm run generate:types
# Payload auto-generates schema
```

### Production (Supabase PostgreSQL)
```bash
npm run generate:types
# Push to production branch
git push origin main

# Vercel auto-deploys and runs migrations
```

---

## Backups

### Supabase
Automatic daily backups included. Restore from dashboard if needed.

### Self-Hosted SQLite
```bash
# Backup
cp mosque.db mosque.db.backup-$(date +%Y%m%d)

# Restore
cp mosque.db.backup-YYYYMMDD mosque.db
```

---

## Monitoring & Logs

### Vercel
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Logs: Click project → **Deployments** → **Logs**
- Analytics: Real-time HTTP traffic & performance

### Self-Hosted
```bash
# Docker logs
docker logs container-name -f

# System logs (Linux)
journalctl -u docker -f
```

---

## SSL/HTTPS

- **Vercel:** Automatic ✅
- **Docker + Nginx:** Use Let's Encrypt
  ```bash
  docker run -d -p 80:80 -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt \
    certbot/certbot certonly --standalone -d your-domain.com
  ```
- **Cloud providers:** Use their managed SSL

---

## Email Setup

### Gmail (Development)
1. Enable 2-Factor Authentication
2. Generate app password at myaccount.google.com/apppasswords
3. Use as `SMTP_PASS`

### SendGrid
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-api-key
```

### AWS SES
```
SMTP_HOST=email-smtp.REGION.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-username
SMTP_PASS=your-ses-password
```

---

## Cron Jobs (Monthly Pledges)

### Vercel (Automatic)
- Defined in `vercel.json`
- Runs daily at 2 AM UTC
- Automatically calls `/api/process-pledges`

### Non-Vercel Platforms

Set up cron job to POST to `/api/process-pledges`:

**GitHub Actions:**
```yaml
# .github/workflows/process-pledges.yml
name: Process Pledges
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger pledge processing
        run: |
          curl -X POST https://your-domain.com/api/process-pledges \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

**External Cron Service (cron-job.org):**
1. Create account
2. Add new cronjob
3. URL: `https://your-domain.com/api/process-pledges`
4. Method: POST
5. Header: `Authorization: Bearer YOUR_CRON_SECRET`
6. Schedule: Daily 2 AM

---

## Troubleshooting

### Supabase Connection Timeout (Vercel)
```
Error: timeout exceeded when trying to connect
```
- **Cause:** Using direct Supabase connection URL instead of the pooler URL
- **Fix:**
  1. Go to Supabase → **Settings** → **Database** → **Connection string**
  2. Select **Transaction** mode
  3. Copy the URL — it should use `pooler.supabase.com` and port `6543`
  4. Update `DATABASE_URL` in Vercel environment variables
  5. Redeploy

  ✅ Correct: `postgresql://postgres.[ref]:pass@aws-0-[region].pooler.supabase.com:6543/postgres`
  ❌ Wrong: `postgresql://postgres:pass@db.[ref].supabase.co:5432/postgres`

- **Also check:** Your Supabase project is not paused (free tier pauses after 7 days of inactivity)

### Database Connection Error
```
Error: ENOENT: no such file or directory
```
- **Cause:** `DATABASE_URL` not set or file path incorrect
- **Fix:** Verify env var, ensure Supabase credentials are correct

### Payment Gateway Issues
```
Error: TayyibPay bill creation failed
```
- **Cause:** Invalid `TOYYIBPAY_SECRET_KEY` or `TOYYIBPAY_CATEGORY_CODE`
- **Fix:** Check credentials in TayyibPay dashboard

### Email Notifications Not Sending
```
Error: SMTP connection refused
```
- **Cause:** SMTP credentials invalid or server unreachable
- **Fix:** Test credentials with `telnet`, verify firewall rules

### Next.js Build Fails
```
Error: standalone output is required for Docker
```
- **Cause:** `next.config.mjs` missing `output: 'standalone'`
- **Fix:** Verify setting is present in config

---

## Performance Optimization

### Enable Caching
```bash
# Vercel: Automatic via ISR/revalidation
# Self-hosted: Add Redis or CDN (Cloudflare)

# In Next.js pages:
export const revalidate = 3600 // ISR: revalidate every hour
```

### Database Indexes
In Payload admin, ensure common query fields have indexes:
- `announcements.date`
- `events.date`
- `gallery.category`
- `contact-messages.createdAt`

### Image Optimization
- Use Next.js `<Image>` component (auto optimization)
- Upload compressed images to Media collection

---

## Support

- **Documentation:** See [README.md](./README.md)
- **Payload CMS:** https://payloadcms.com/docs
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs

**Need help?** Open an issue on GitHub or contact your dev team.
