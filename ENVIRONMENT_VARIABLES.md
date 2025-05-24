# Environment Variables Configuration

This document explains how environment variables are managed in this project for security and proper deployment.

## 🔒 Security-First Approach

**NEVER commit actual environment variable values to the repository!**

## 📁 File Structure

- `wrangler.toml` - Contains only non-sensitive configuration
- `.dev.vars` - Local development variables (ignored by git)
- `.dev.vars.example` - Template showing required variables
- Cloudflare Pages Dashboard - Production environment variables

## 🚀 For Deployment (Cloudflare Pages)

Environment variables are set in **Cloudflare Pages Dashboard**:
1. Go to Cloudflare Dashboard > Pages > Your Project
2. Navigate to **Settings** > **Environment variables**
3. Set for both **Production** and **Preview** environments:
   - `NODE_VERSION = 20`
   - `NEXT_PUBLIC_SUPABASE_URL = your_supabase_url`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key`

## 💻 For Local Development

1. Copy the example file:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Edit `.dev.vars` with your actual values:
   ```
   NODE_VERSION="20"
   NEXT_PUBLIC_SUPABASE_URL="your_actual_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_actual_anon_key"
   ```

3. The `.dev.vars` file is automatically ignored by git

## 🛡️ Security Features

- ✅ No sensitive data in `wrangler.toml`
- ✅ `.dev.vars` is git-ignored
- ✅ Environment variables loaded automatically from Cloudflare Pages
- ✅ Template file (`.dev.vars.example`) shows required structure

## 🔧 How It Works

1. **Local Development**: Variables loaded from `.dev.vars`
2. **Cloudflare Pages**: Variables loaded from dashboard settings
3. **Build Process**: All variables available via `process.env`

## ✅ Current Required Variables

- `NODE_VERSION` - Specifies Node.js version for deployment
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 🚨 If You Accidentally Commit Secrets

1. Immediately regenerate the exposed keys
2. Update Cloudflare Pages environment variables
3. Update your local `.dev.vars` file
4. The git history is already cleaned in this project 