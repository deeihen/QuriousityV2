# Quriousity V2 Security Guide (Supabase RLS)

To prevent users from "draining your tokens" or spamming your database, you **MUST** enable Row Level Security (RLS) in your Supabase Dashboard. Without this, anyone with your API key can delete or modify any data in your database.

## 1. Enable RLS for all tables
In the Supabase Dashboard, go to **Database -> Tables** and ensure **RLS is enabled** for:
- `quizzes`
- `questions`
- `scores`
- `responses`
- `lobby_participants`
- `feedback`

## 2. Recommended Policies

### Quizzes Table
- **SELECT**: Allow `anon` and `authenticated` (anyone can join a quiz if they have the code).
- **INSERT**: Allow `authenticated` only (only professors can create quizzes).
- **UPDATE/DELETE**: Allow only the owner (`auth.uid() = user_id`).

### Questions Table
- **SELECT**: Allow `anon` and `authenticated`.
- **INSERT/UPDATE/DELETE**: Allow `authenticated` only (ideally restricted to the quiz owner).

### Scores & Responses Table (Critical for Anti-Spam)
- **INSERT**: Allow `anon` and `authenticated`.
- **SELECT**: Allow `anon` and `authenticated`.
- **UPDATE/DELETE**: **DISABLE ALL**. Once a score is submitted, it should never be changeable by a user.

### Feedback Table
- **INSERT**: Allow `anon`.
- **SELECT/UPDATE/DELETE**: **DISABLE ALL** for `anon`. Only you (service_role or dashboard) should see feedback.

## 3. Rate Limiting (Supabase Settings)
Go to **Settings -> Authentication -> Rate Limits**:
- **Email Rate Limit**: Set to `3` per hour (prevents spamming signups).
- **Sms Rate Limit**: If using phone, set strictly.

## 4. Cost Protection
- **Storage**: If you allow image uploads later, set a max file size in Supabase Storage.
- **Database**: Set up **Cost Alerts** in your Supabase project settings to get notified if your usage spikes.

## 5. Score Integrity (Advanced)
Currently, scores are calculated on the frontend (`calculateScore` in `utils.ts`). A skilled user could manually call the Supabase API with a fake high score.
- **Mitigation**: To prevent this, you would ideally use **Supabase Edge Functions** to calculate scores on the server side, or use **PostgreSQL Functions** (stored procedures) that calculate the score based on the time the response was received compared to the quiz start time.

---
*Note: I have already implemented frontend rate limiting in the React code to prevent accidental double-submissions and simple botting.*
