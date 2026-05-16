# Quriousity V2 - Real-Time Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth/DB/Realtime-green.svg)](https://supabase.com/)

**Quriousity V2** is a modern, interactive, and high-performance quiz platform built for students and educators. It facilitates real-time engagement, live leaderboards, and deep performance analytics through a clean, minimalist, and mobile-first interface.

> [!IMPORTANT]
> This project is under active development and we are **still finding bugs**. If you encounter any issues, please report them or contribute a fix!

---

## 🚀 Key Features

### 🎮 Gamification & Engagement
- **XP & Leveling System:** Users earn points by participating in quizzes, unlocking higher levels as they grow.
- **Daily Streaks:** Maintains user motivation through consecutive activity tracking (🔥 Streak system).
- **Achievements:** Earn unique digital badges like "Quiz Master" and "Perfect Aim" based on performance milestones.
- **Unified Account Model:** A single login for both quiz creators and participants.

### 📊 Advanced Analytics
- **Visual Insights:** High-fidelity charts using `Recharts` showing "Most Missed Questions," "Score Distribution," and "Average Time per Question."
- **Export Capabilities:** Generate professional CSV data for detailed external analysis.
- **Live Monitoring:** Real-time synchronized lobby and session management.

### 🛡️ Hardened Security
- **Row Level Security (RLS):** Fully isolated data environments ensuring data privacy and integrity at the database level.
- **Abuse Prevention:** Centralized rate-limiting logic on all critical actions (Joining, Creating, Feedback) to prevent spam and bot attacks.

### 📱 Native Mobile Experience (PWA)
- **Installable:** Fully compliant Progressive Web App—install Quriousity directly on your home screen.
- **Offline Resiliency:** Optimized asset caching for fast load times even on spotty school networks.
- **Mobile-First UX:** A "Professional Minimalist" UI designed specifically for touch interactions and small screens.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS v4, Framer Motion (Animations).
- **Icons:** Lucide React.
- **Charts:** Recharts.
- **Backend:** Supabase (PostgreSQL, Realtime, GoTrue Auth).
- **Internationalization:** i18next (Supporting English, Spanish, Tagalog, and French).

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- A Supabase Project ([Create one here](https://supabase.com/))

### 2. Installation
```bash
git clone https://github.com/deeihen/QuriousityV2
cd QuriousityV2
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup
Execute the SQL found in `SECURITY_GUIDE.md` within your Supabase SQL Editor to initialize the tables and Row Level Security policies.

### 5. Run Locally
```bash
npm run dev
```

---

## 📖 Documentation
- [Security & RLS Guide](SECURITY_GUIDE.md) - Crucial steps to secure your backend.
- [Contributing Guidelines](CONTRIBUTING.md) - How to help improve Quriousity.
- [Project Changelog](CHANGELOG.md) - Details on the latest major updates.

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed with ❤️ for Educators and Learners worldwide.*
