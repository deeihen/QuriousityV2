# Quriousity V2 - Real-Time Learning Platform

Quriousity V2 is a modern, interactive quiz platform designed for students and professors. It facilitates real-time engagement, live leaderboards, and deep performance analytics.

## 🚀 Key Features

### 🎮 Student Gamification (New!)
- **XP & Leveling System:** Earn points to level up and track progress.
- **Daily Streaks:** Stay motivated with consecutive activity tracking.
- **Achievements:** Unlock badges like "Quiz Master" and "Perfect Aim."

### 📊 Advanced Professor Analytics (New!)
- **Visual Insights:** High-quality charts showing "Most Missed Questions," "Score Distribution," and "Average Time per Question."
- **Export Capabilities:** Generate professional PDF class reports or download CSV data for detailed analysis.
- **Live Monitoring:** Real-time lobby and session management.

### 🛡️ Hardened Security
- **Row Level Security (RLS):** Fully isolated data environments ensuring professors only see their own quizzes and student scores are protected.
- **Abuse Prevention:** Intelligent rate-limiting on all critical actions to prevent spam and brute-force attacks.

### 📱 Progressive Web App (PWA)
- **Native Experience:** "Install" the app on your mobile device for full-screen, native-feeling interactions.
- **Performance:** Optimized for fast load times even on spotty school networks.

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Framer Motion.
- **Backend:** Supabase (Auth, Database, Realtime).
- **Internationalization:** Multi-language support (EN, ES, TL, FR).

## 🚦 Getting Started

1. **Clone & Install:**
   ```bash
   git clone https://github.com/deeihen/QuriousityV2
   npm install
   ```
2. **Environment Setup:** Create a `.env` file with your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **Run Locally:**
   ```bash
   npm run dev
   ```

---
*Created with ❤️ for Educators and Learners.*
