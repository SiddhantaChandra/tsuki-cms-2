# Environment Variables Guide for Tsuki CMS v2

This guide explains all the different ways you can set environment variables for your Tsuki CMS v2 deployment.

## 🚀 Quick Solution: Manual Override

If environment variables aren't working through other methods, you can **manually set them directly in the script**:

1. Open `generate-wrangler.js`
2. Find the `MANUAL_OVERRIDES` section (around line 34)
3. Uncomment and set your values:

```javascript
const MANUAL_OVERRIDES = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://your-project-id.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-actual-anon-key-here',
  NODE_VERSION: '20'
};
```

This method has **highest priority** and will override all other sources.

## 📋 Environment Variable Priority Order

The script checks for environment variables in this order (highest to lowest priority):

1. **Manual Overrides** (in `generate-wrangler.js`)
2. **Process Environment** (from Cloudflare Pages or system)
3. **`.env.local`** (for local development)
4. **`.env.production`** (for production builds)
5. **`.env`** (default environment file)

## 🔧 Method 1: Cloudflare Pages Dashboard (Recommended for Production)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** > **Your Project**
3. Click on **Settings** tab
4. Scroll to **Environment variables**
5. Add these variables:
   - `NODE_VERSION` = `20`
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key

## 🔧 Method 2: Local .env Files (For Development & Testing)

Create a `.env.local` file in your project root:

```bash
# .env.local
NODE_VERSION=20
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Available .env Files:
- **`.env.local`** - Local development (highest priority)
- **`.env.production`** - Production environment
- **`.env`** - Default for all environments

## 🔧 Method 3: Manual Override (Guaranteed to Work)

Edit `generate-wrangler.js` directly:

```javascript
// Find this section in generate-wrangler.js
const MANUAL_OVERRIDES = {
  // Uncomment and set these values:
  NEXT_PUBLIC_SUPABASE_URL: 'https://your-project-id.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-anon-key-here',
  NODE_VERSION: '20'
};
```

**Benefits:**
- ✅ Guaranteed to work regardless of other configurations
- ✅ No dependency on external environment settings
- ✅ Works immediately without additional setup

**Considerations:**
- ⚠️ Don't commit sensitive keys to public repositories
- ⚠️ Remember to update when keys change

## 🔧 Method 4: System Environment Variables

Set environment variables in your system:

### Windows (PowerShell):
```powershell
$env:NODE_VERSION="20"
$env:NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### Linux/macOS:
```bash
export NODE_VERSION=20
export NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

## 🔍 Debugging Environment Variables

Run the generation script to see detailed debugging information:

```bash
node generate-wrangler.js
```

The script will show:
- ✅ Which environment variables are found/missing
- 📄 Which .env files are loaded
- 📋 The source of each variable (manual override, process env, .env file, etc.)
- ⚠️ Warnings about missing variables with solutions

## 🛠️ Troubleshooting

### Problem: Variables not working in Cloudflare Pages

**Solution 1: Manual Override (Fastest)**
```javascript
// In generate-wrangler.js
const MANUAL_OVERRIDES = {
  NEXT_PUBLIC_SUPABASE_URL: 'your-actual-url',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-actual-key',
  NODE_VERSION: '20'
};
```

**Solution 2: Check Cloudflare Settings**
- Ensure variables are set for **Production** environment
- Verify variable names are exact matches
- Redeploy after setting variables

**Solution 3: Use .env.local for testing**
- Create `.env.local` with your values
- Test locally first: `npm run pages:build-windows`

### Problem: Variables working locally but not in production

1. **Check Cloudflare Dashboard**: Verify all variables are set
2. **Check Build Logs**: Look for environment variable debugging output
3. **Use Manual Override**: Add values directly to `generate-wrangler.js`

### Problem: Build fails with "environment variables missing"

1. **Immediate fix**: Use manual override method
2. **Long-term fix**: Set up proper environment variables in Cloudflare

## 📝 Required Variables

For successful deployment, you need these variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_VERSION` | Cloudflare Node.js version | `20` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |

## 🔐 Security Notes

- ✅ `NEXT_PUBLIC_*` variables are safe to expose (they're public)
- ✅ The anon key is designed to be public
- ⚠️ Never commit actual secret keys to git repositories
- ✅ Manual overrides are excluded from deployment via `.cfignore`

## 🚀 Quick Start

**For immediate deployment:**

1. Edit `generate-wrangler.js`
2. Set your values in `MANUAL_OVERRIDES`
3. Run `npm run pages:build-windows` to test
4. Deploy via Git integration

This guarantees your environment variables will work! 🎉 