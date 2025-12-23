# 🕌 Mosque Website & Management System

A modern, high-performance landing page for mosques built with **Next.js 15**, **Tailwind CSS**, and **Sanity Headless CMS**. This project automates prayer scheduling and religious content management to keep the community informed.

## 🚀 Key Features

* [cite_start]**Automated Prayer Schedules**: Fetches daily and monthly prayer timings directly from the Aladhan API via local API routes[cite: 1, 36, 102].
* **Dynamic Friday Prayer Hub**: Automatically detects the upcoming Friday and pulls the specific Dhuhr time, Khatib, and Bilal assignments.
* **Weekly Roster Management**: A custom Sanity CMS schema for managing Imam and Bilal rotations across all five daily prayers.
* **Sermon Archive**: Integration for publishing weekly Khutbah details, including titles, summaries, and topics.
* [cite_start]**Zakat Awareness**: Dedicated sections to highlight the importance of Zakaat and its impact on the local community[cite: 5, 25].

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **CMS**: [Sanity.io](https://www.sanity.io/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Components**: [Shadcn UI](https://ui.shadcn.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **API**: [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api)

## 🏁 Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/dzaffren/mosque-website.git](https://github.com/dzaffren/mosque-website.git)
cd mosque-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a .env.local file in the root directory and add your Sanity credentials:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
```

### 4. Run the development server
```bash
npm run dev
```
Open http://localhost:3000 to view the site.

## 📂 Project Structure
- `app/friday-prayer/page.tsx`: Logic for automated Friday detection and sermon display.

- `app/prayer-times/page.tsx`: Monthly schedule table with Hijri date support.

- `app/api/prayer-times/`: Local API routes for fetching and formatting external prayer data.

- `sanity/schemaTypes/`: Custom schemas for Events, News, Weekly Rosters, and Sermons.

## 📡 API Endpoints
- `GET /api/prayer-times/monthly`: Returns formatted prayer times for the current month including the year for reliable parsing.

- `GET /api/prayer-times/daily`: Returns today's specific prayer and iqamah times.

## 📝 License
This project is open-source and intended for mosque community use.