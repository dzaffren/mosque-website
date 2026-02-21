# 🕌 Mosque Website - Payload CMS

A full-featured mosque website built with **Next.js 15**, **Payload CMS 3.77**, and **Tailwind CSS 4**. Multi-language support (English & Malay), integrated payments (TayyibPay), WhatsApp community integration, and comprehensive admin panel.

## ✨ Features

- **Dynamic Content Management** — Announcements, Events, Gallery, Staff directory via Payload CMS
- **Prayer Times** — Live Aladhan API integration + monthly calendar + imam/bilal roster
- **Jumu'ah Schedule** — Khutbah schedules, sermon portal links, guidelines
- **Donation System** — TayyibPay integration with one-time & recurring monthly pledges
- **Contact Form** — Tabbed feedback/inquiry form with email notifications
- **WhatsApp Community** — Easy join button on homepage, footer, and contact page
- **Multi-Language** — English & Malay (i18n via next-intl)
- **Responsive Design** — Mobile-first with Tailwind CSS

## 🚀 Quick Start

### Local Development (SQLite)

1. **Clone & Install**
```bash
git clone <repository>
cd mosque-website
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your configuration (SMTP, TayyibPay keys, etc.)
```

3. **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Seed Sample Data** (optional)
```bash
npm run seed
```

**Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)  
**Login:** admin@mosque.com / changeme123

### Docker Development

```bash
docker-compose up
```

This runs the app with SQLite. Database file persists in `mosque.db`.

## 📦 Production Setup (Supabase + Vercel)

### 1. Create Supabase Project

1. Sign up at [supabase.com](https://supabase.com)
2. Create new PostgreSQL database
3. Copy the connection string from **Project Settings** → **Database** → **Connection Strings**
4. Format: `postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?schema=public`

### 2. Deploy to Vercel

1. Push code to GitHub:
   ```bash
   git push
   ```

2. Import project in [Vercel](https://vercel.com) (or redeploy if already imported)

3. Add environment variables in **Project Settings** → **Environment Variables**:
   ```
   DATABASE_URL = postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?schema=public
   PAYLOAD_SECRET = <generate-a-random-secret>
   NEXT_PUBLIC_SITE_URL = https://your-domain.com
   SMTP_HOST = <your-smtp-provider>
   SMTP_PORT = 587
   SMTP_USER = <your-email>
   SMTP_PASS = <your-password>
   CONTACT_EMAIL_TO = admin@your-mosque.com
   TOYYIBPAY_SECRET_KEY = <your-key>
   TOYYIBPAY_CATEGORY_CODE = <your-code>
   CRON_SECRET = <generate-random>
   ```

4. Vercel automatically deploys when environment variables are set

### 3. Database Auto-Initialization

- First deployment takes 2-3 minutes
- Payload CMS automatically creates all tables in PostgreSQL
- No manual migration scripts needed

### 4. Local Development (Still Uses SQLite)

Local development continues to use SQLite:
```bash
npm run dev
```

The database adapter automatically selects SQLite for `NODE_ENV !== 'production'`.

### How It Works

The `src/payload.config.ts` contains conditional adapter logic:
- **Development** (`NODE_ENV !== 'production'`): SQLite (`file:./mosque.db`)
- **Production** (`NODE_ENV === 'production'`): PostgreSQL via `DATABASE_URL`

Vercel automatically sets `NODE_ENV=production`, so the switch is automatic!

### Manual Deployment Alternative

If not using Vercel, you can deploy to any Node.js platform:
```bash
npm run build
npm start
```

Ensure `DATABASE_URL` environment variable is set to your Supabase PostgreSQL connection string.

## 🔧 Configuration

### CMS Settings

Edit in **Admin Panel** → **Mosque Settings**:
- Mosque name, address, phone, email
- Map coordinates
- Social media links
- Bank transfer details
- Donation QR code
- WhatsApp group URL
- Jumu'ah time & sermon portal

### Collections

| Collection | Purpose |
|---|---|
| **Users** | Admin accounts |
| **Media** | Images/files for uploads |
| **Announcements** | Mosque announcements |
| **Events** | Upcoming/past events |
| **Prayer Times** | Daily prayer times (populated by Aladhan API) |
| **Prayer Roster** | Weekly imam/bilal roster |
| **Khutbah Schedule** | Friday sermon topics |
| **Gallery** | Image gallery by category |
| **Staff** | Staff directory |
| **Donations** | One-time donation records |
| **Pledges** | Recurring monthly pledges |
| **Contact Messages** | Feedback & inquiry submissions |

## 📧 Email Notifications

The contact form sends emails via **nodemailer** (SMTP). Configure your SMTP provider:

- Gmail: Enable 2FA + generate app password
- SendGrid, Mailgun, AWS SES: Use your provider credentials
- Local testing: Use [Mailtrap](https://mailtrap.io) or [MailHog](https://github.com/mailhog/MailHog)

## 💳 Payments (TayyibPay)

1. Register at [TayyibPay](https://toyyibpay.com)
2. Get your **Secret Key** and **Category Code**
3. Add to `.env`:
   ```
   TOYYIBPAY_SECRET_KEY=your-key
   TOYYIBPAY_CATEGORY_CODE=your-code
   ```

### Monthly Pledges

Pledges are processed via **Vercel Cron** (defined in `vercel.json`):
- Daily at 2 AM UTC, the `/api/process-pledges` endpoint runs
- Creates new bills for active pledges
- Updates payment status via TayyibPay callbacks

For non-Vercel deployments, set up external cron (GitHub Actions, cron.io, etc.) to call:
```
POST https://your-domain.com/api/process-pledges
Authorization: Bearer <CRON_SECRET>
```

## 🌍 Internationalization

- **English** (en) & **Malay** (ms) translation keys in `src/messages/`
- Add new languages by creating `src/messages/{lang}.json`
- Update `src/i18n/routing.ts` to register the language

## 🧪 Testing

```bash
# Unit tests (Vitest)
npm run test:int

# E2E tests (Playwright)
npm run test:e2e

# Linting
npm run lint
```

## 📂 Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public website
│   │   ├── [locale]/        # i18n-wrapped pages
│   │   │   ├── page.tsx     # Home
│   │   │   ├── prayer-times/
│   │   │   ├── about/
│   │   │   ├── events/
│   │   │   ├── contact/
│   │   │   ├── donation/
│   │   │   ├── gallery/
│   │   │   └── jumuah/
│   │   └── layout.tsx       # Root layout
│   ├── (payload)/           # Payload CMS admin
│   └── api/                 # API routes
├── collections/             # CMS collection configs
├── components/              # React components
├── globals/                 # CMS global configs
├── i18n/                    # Internationalization
├── messages/                # Translation files
├── seed/                    # Sample data
└── payload.config.ts        # Payload CMS config
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy (cron jobs via `vercel.json`)

### Docker

```bash
docker build -t mosque-website .
docker run -p 3000:3000 -e DATABASE_URL=... mosque-website
```

### Supabase Setup

1. Create PostgreSQL database on Supabase
2. Update `src/payload.config.ts` to use PostgreSQL adapter (if not already)
3. Set `DATABASE_URL` in environment
4. Run migrations: `npm run generate:types`

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with SQLite |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with demo data |
| `npm run generate:types` | Regenerate Payload types |
| `npm run generate:importmap` | Regenerate admin import map |
| `npm run lint` | Run ESLint |
| `npm run test:int` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |

## 🎨 Customization

### Colors

Edit theme in `src/app/(frontend)/globals.css`:

```css
@theme {
  --color-primary: #059669;
  --color-primary-dark: #064E3B;
  --color-accent: #D4AF37;
  --color-background: #FAFAF9;
  --color-foreground: #1C1917;
}
```

### Languages

Add new language:
1. Create `src/messages/{lang}.json` with all translation keys
2. Update `src/i18n/routing.ts` to include the language
3. Rebuild admin import map: `npm run generate:importmap`

## 📄 License

MIT

## 🤝 Support

For issues or questions:
1. Check [GitHub Issues](./issues)
2. Create a new issue with details
3. Contact your mosque admin

---

**Built with ❤️ for the Muslim community**
