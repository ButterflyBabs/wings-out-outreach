# 🚀 Wings Out Outreach - Setup Instructions

## Step 1: Create GitHub Repository

### Option A: Using GitHub CLI (if installed)
```bash
gh auth login
gh repo create wings-out-outreach --public --description "Babs & Beau Ambassador Outreach System"
```

### Option B: Using GitHub Web Interface
1. Go to https://github.com/new
2. Repository name: `wings-out-outreach`
3. Description: `Babs & Beau Ambassador Outreach System`
4. Make it **Public**
5. Click "Create repository"

### Option C: Manual Git Commands
```bash
# After creating repo on GitHub web:
git remote add origin https://github.com/amilynne-carroll/wings-out-outreach.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Supabase

1. Go to https://supabase.com
2. Click "New Project"
3. Organization: Your org
4. Project name: `wings-out-outreach`
5. Database password: (generate strong password)
6. Region: `US West (N. California)` (closest to Denver)
7. Click "Create new project"

### Run Database Migrations

1. In Supabase Dashboard, go to SQL Editor
2. Click "New query"
3. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Verify all 14 tables created

### Get API Credentials

1. Go to Project Settings → API
2. Copy `URL` (this is NEXT_PUBLIC_SUPABASE_URL)
3. Copy `anon public` key (this is NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Step 3: Deploy to Vercel

### Option A: Vercel CLI
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name: wings-out-outreach
# - Directory: . (current)
```

### Option B: GitHub Integration (Recommended)

1. Go to https://vercel.com/new
2. Import Git Repository
3. Select `wings-out-outreach`
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (leave default)
   - Output Directory: (leave default)
5. Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
6. Click "Deploy"

## Step 4: Configure Environment Variables

### In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click "Save"
4. Redeploy if needed

### For Local Development:

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

## Step 5: Set Up GitHub Secrets (for Auto-Deploy)

1. Go to GitHub Repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:
   - `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` - Get from Vercel project settings
   - `VERCEL_PROJECT_ID` - Get from Vercel project settings
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 6: Verify Deployment

1. Visit your Vercel URL (e.g., `https://wings-out-outreach.vercel.app`)
2. You should see the Wings Out Outreach dashboard
3. Test navigation
4. Verify no console errors

## Step 7: Set Up Gmail Integration (Phase 3)

1. Go to https://console.cloud.google.com
2. Create new project: `wings-out-outreach`
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://wings-out-outreach.vercel.app/api/auth/callback/google` (prod)
6. Download client_secret.json
7. Add to environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## 📋 Post-Deployment Checklist

- [ ] GitHub repo created and code pushed
- [ ] Supabase project created
- [ ] Database migrations run successfully
- [ ] Vercel project deployed
- [ ] Environment variables configured
- [ ] Site loads without errors
- [ ] GitHub Actions secrets added
- [ ] Auto-deployment working (push to main triggers deploy)

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run database type generation
npm run db:generate
```

## 🆘 Troubleshooting

### Build Fails
- Check environment variables are set
- Verify Supabase credentials are correct
- Check Vercel build logs

### Database Connection Issues
- Verify RLS policies are enabled
- Check Supabase URL and anon key
- Ensure database migrations ran successfully

### Gmail OAuth Issues
- Verify redirect URIs match exactly
- Check OAuth consent screen is configured
- Ensure Gmail API is enabled

## 📞 Support

For issues or questions:
- Check README.md for detailed documentation
- Review database schema in `supabase/migrations/`
- Contact: amilynne@amilynne.com

---

**You're all set!** 🦋🐕‍🦺