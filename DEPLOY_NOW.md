# 🚀 DEPLOY NOW - Complete Setup Commands

## Step 1: Create GitHub Repository

Go to https://github.com/new and create a new repository:
- **Repository name**: `wings-out-outreach`
- **Description**: `Babs & Beau Ambassador Outreach System`
- **Public**: Selected
- **Initialize**: DO NOT check "Add a README file"

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd /root/.openclaw/workspace/wings-out-outreach

# Add the remote
git remote add origin https://github.com/amilynne-carroll/wings-out-outreach.git

# Push to main branch
git push -u origin main
```

## Step 3: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Organization: Select yours
4. Project name: `wings-out-outreach`
5. Database password: (generate a strong password)
6. Region: `US West (N. California)` (us-west-1)
7. Click "Create new project"

### Run Database Migration

1. In Supabase Dashboard, click "SQL Editor" (left sidebar)
2. Click "New query"
3. Open file: `wings-out-outreach/supabase/migrations/001_initial_schema.sql`
4. Copy ALL contents
5. Paste into SQL Editor
6. Click "Run"
7. Verify: Click "Table Editor" - you should see 14 tables

### Get API Keys

1. Click "Project Settings" (gear icon)
2. Click "API"
3. Copy these values:
   - **Project URL** (this is `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd /root/.openclaw/workspace/wings-out-outreach
vercel --prod

# Answer prompts:
# ? Set up and deploy ".../wings-out-outreach"? [Y/n] Y
# ? Which scope do you want to deploy to? [Select your account]
# ? Link to existing project? [y/N] N
# ? What's your project name? [wings-out-outreach]
```

### Option B: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Find and select `wings-out-outreach`
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (leave default)
   - Output Directory: (leave default)
5. Environment Variables - Add these:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
6. Click "Deploy"

## Step 5: Verify Deployment

1. Vercel will provide a URL like: `https://wings-out-outreach.vercel.app`
2. Visit the URL
3. You should see the Wings Out Outreach dashboard
4. Check browser console for any errors

## 📋 Quick Reference

### Environment Variables Needed

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Project Files Location

```
/root/.openclaw/workspace/wings-out-outreach/
```

### Git Status

```bash
cd /root/.openclaw/workspace/wings-out-outreach
git status
git log --oneline
```

## ✅ Post-Deployment Checklist

- [ ] GitHub repo created at https://github.com/amilynne-carroll/wings-out-outreach
- [ ] Code pushed to main branch
- [ ] Supabase project created
- [ ] Database migration run (14 tables created)
- [ ] Vercel project deployed
- [ ] Environment variables configured
- [ ] Site loads at Vercel URL
- [ ] Dashboard displays correctly
- [ ] No console errors

## 🆘 Troubleshooting

### "Repository not found" when pushing
- Make sure you created the GitHub repo first
- Check the URL is correct

### Build fails on Vercel
- Check environment variables are set correctly
- Verify Supabase project is active
- Check Vercel build logs

### Database connection errors
- Verify RLS policies are enabled
- Check Supabase URL and anon key match
- Ensure database migration ran successfully

## 🎉 Success!

Once complete, you'll have:
- ✅ GitHub repository with full codebase
- ✅ Supabase database with 14 tables
- ✅ Vercel deployment with live URL
- ✅ Wings Out Outreach dashboard accessible

**Ready for Phase 2!** 🦋🐕‍🦺
