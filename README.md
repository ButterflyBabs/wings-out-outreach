# 🦋🐕‍🦺 Wings Out Outreach

**Babs & Beau Ambassador Outreach System**

A complete partnership management platform for Babs Carroll (quadriplegic accessibility creator, author, speaker) and Beau (her fully trained service dog) to identify, qualify, contact, and win paid ambassador, affiliate, and brand partnership opportunities.

## 🎯 Mission

Help Babs and Beau create meaningful partnerships with companies that serve the disability community, while maintaining full accessibility and Babs's final approval on all outreach.

## ✨ Features

### Phase 1: Foundation ✅ (Complete)
- **14 Database Tables** - Complete PostgreSQL schema with RLS
- **Accessible Dashboard** - Keyboard, screen reader, and voice-control friendly
- **LifeCharter Brand Integration** - Consistent visual identity
- **Responsive Design** - Works on all devices

### Phase 2: Research & Scoring (Coming Soon)
- AI-powered company research
- Opportunity fit scoring (accessibility, revenue, brand alignment)
- Automated priority ranking

### Phase 3: Gmail Integration (Coming Soon)
- OAuth Gmail connection
- Draft creation for approval
- Reply detection and tracking

### Phase 4: Follow-Up Automation (Coming Soon)
- Business-day scheduling
- Smart stop rules
- Reply classification

### Phase 5-7: Applications, Revenue, Discovery (Coming Soon)
- Application tracking
- Contract management
- Revenue reporting
- Automated discovery

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Email**: Gmail API (OAuth)
- **AI**: OpenAI API
- **Deployment**: Vercel
- **Timezone**: America/Denver

## 🗄️ Database Schema

### Core Tables
1. **companies** - Prospect companies with accessibility scoring
2. **contacts** - People at companies
3. **programs** - Ambassador/affiliate programs
4. **opportunities** - Pipeline with 25 stages
5. **outreach_messages** - Email drafts and history
6. **email_threads** - Gmail thread tracking
7. **applications** - Program applications
8. **partnership_assets** - Bios, photos, media kits
9. **partnership_agreements** - Contracts
10. **deliverables** - Content obligations
11. **affiliate_links** - Tracking links
12. **revenue** - Income tracking
13. **tasks** - To-do items
14. **suppression_list** - Do-not-contact

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account
- Gmail API credentials (for email features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amilynne-carroll/wings-out-outreach.git
   cd wings-out-outreach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials and other secrets.

4. **Run database migrations**
   - Copy the SQL from `supabase/migrations/001_initial_schema.sql`
   - Run in Supabase SQL Editor

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 🎨 Design System

### Colors
- **Deep Indigo** `#1F315B` - Primary background
- **Royal Plum** `#5E3B6C` - Secondary accents
- **Sacred Teal** `#2E7C83` - Primary actions
- **Warm Gold** `#D4AF63` - Highlights, icons
- **Ivory Light** `#F6F1E8` - Text

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body**: Inter (sans-serif)

### Accessibility
- Full keyboard navigation
- Screen reader optimized
- High contrast mode
- Reduced motion support
- Large click targets (min 44px)
- Voice control friendly

## 📊 Opportunity Scoring

Each opportunity is scored 0-100 based on:
- **Accessibility Fit** (25%) - Relevance to quadriplegic users
- **Revenue Potential** (25%) - Commission, flat fees, licensing
- **Brand Alignment** (20%) - Ethics, product usefulness
- **Relationship Value** (15%) - Long-term potential
- **Service-Dog Fit** (10%) - Beau's involvement
- **Response Probability** (5%) - Likelihood of reply

**Priority Levels**:
- 80-100: Priority A (Immediate action)
- 65-79: Priority B (This week)
- 50-64: Priority C (This month)
- Below 50: Archive

## ✉️ Email Workflow

1. **Research** - AI gathers company info
2. **Score** - Calculate priority
3. **Draft** - AI writes personalized email
4. **Approve** - Babs reviews in dashboard
5. **Send** - Creates Gmail draft
6. **Monitor** - Track replies automatically
7. **Follow Up** - Scheduled business-day reminders

## 🔒 Security & Privacy

- Row Level Security (RLS) on all tables
- OAuth for Gmail (no password storage)
- Environment variables for secrets
- No PII in logs
- Opt-out honored immediately
- Babs approves every email before sending

## 📈 Success Metrics

Track:
- Qualified companies added per week
- Personalized drafts produced
- Reply rate
- Application approval rate
- Partnership close rate
- Revenue per outreach
- Revenue per partnership

## 🤝 Partnership Categories

- Mobility equipment
- Accessible vehicles
- Adaptive clothing
- Assistive technology
- Digital accessibility
- Accessible travel
- Service-dog products
- Health & wellness

## 📄 License

Private - For Babs Carroll's exclusive use.

## 💜 Built With Love

For Babs & Beau, helping them spread accessibility awareness and create meaningful partnerships.

---

**Questions?** Contact: amilynne@amilynne.com