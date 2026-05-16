# Quriousity V2 Security Guide (Supabase RLS)

To ensure the integrity of your data and prevent unauthorized access, you **MUST** enable and configure Row Level Security (RLS) in your Supabase Dashboard. 

## 🚧 Active Development
**Disclaimer:** This project is under active development. While we have implemented multiple layers of security (Rate limiting, RLS templates), we are **still finding bugs**. We recommend setting up [Cost Alerts](https://supabase.com/docs/guides/platform/billing#usage-alerts) in Supabase.

---

## 1. Enable RLS for all tables
Ensure **RLS is enabled** for:
- `quizzes`
- `questions`
- `scores`
- `responses`
- `lobby_participants`
- `feedback`
- `profiles`

## 2. Core Security Policies

### 📚 Quizzes & Questions
- **SELECT**: Public (`true`) so anyone with a room code can participate.
- **INSERT**: `authenticated` only.
- **UPDATE/DELETE**: `auth.uid() = user_id`.

### 🏆 Scores & Responses
- **INSERT**: Public (`true`).
- **SELECT**: Public/Authenticated.
- **UPDATE/DELETE**: **DISABLED**. Scores should be immutable once submitted.

### 👤 Profiles
- **SELECT**: Authenticated.
- **UPDATE**: `auth.uid() = user_id`.

---

## 3. Rate Limiting (Abuse Prevention)
We have implemented a client-side rate limiter in `src/lib/security.ts`. This prevents:
- Rapid-fire quiz joins.
- Spamming quiz creation.
- Flood-submitting feedback.

*Note: For production-grade security, we recommend also setting up backend rate limits in the Supabase Dashboard under Settings -> Authentication.*

---
*Help us improve: If you find a security vulnerability, please report it via the [Contributing Guide](CONTRIBUTING.md).*
