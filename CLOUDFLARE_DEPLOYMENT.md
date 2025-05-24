# Cloudflare Pages Deployment Guide

This guide will help you deploy your Tsuki CMS v2 application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler` or use the local version)
3. Your application configured for Cloudflare Pages (already done)

## Configuration Files

The following files have been configured for Cloudflare Pages deployment:

- `wrangler.toml` - Cloudflare Pages configuration
- `next.config.mjs` - Next.js configuration with Cloudflare setup
- `package.json` - Updated with deployment scripts

## Deployment Methods

### Method 1: Command Line Deployment

#### For Windows Users:
```bash
# Build and deploy (Windows-compatible)
npm run deploy-windows

# Or step by step:
npm run pages:build-windows
wrangler pages deploy .vercel/output/static
```

#### For Linux/macOS Users:
```bash
# Build and deploy
npm run deploy

# Or step by step:
npm run pages:build
wrangler pages deploy .vercel/output/static
```

### Method 2: Git Integration (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to Pages
4. Click "Create a project"
5. Connect your Git repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: Leave empty (for SSR) or `out` (for static export)
   - **Root directory**: `/` (or leave empty)
   - **Environment variables**: Set your Supabase and other environment variables

## Environment Variables

Make sure to set the following environment variables in your Cloudflare Pages project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Any other environment variables your app needs

You can set these in:
- Cloudflare Dashboard > Pages > Your Project > Settings > Environment variables
- Or in your `wrangler.toml` file (not recommended for secrets)

## Local Development with Cloudflare

To test your app locally with the Cloudflare runtime:

```bash
# Build for Cloudflare
npm run pages:build-windows  # Windows
# or
npm run pages:build          # Linux/macOS

# Run local preview
wrangler pages dev .vercel/output/static
```

## Troubleshooting

### Windows Compatibility Issues

If you encounter issues with `@cloudflare/next-on-pages` on Windows, use the Windows-specific commands:
- `npm run pages:build-windows`
- `npm run deploy-windows`

### Build Errors

1. Make sure all your server-side code uses the Edge Runtime where required
2. Check that your middleware is compatible with Cloudflare Pages
3. Ensure all dependencies are compatible with the Edge Runtime

### Environment Variables

Make sure all environment variables are properly set in your Cloudflare Pages project settings.

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/ssr/get-started/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

## Support

If you encounter any issues, check the Cloudflare Pages documentation or the Next.js on Cloudflare Pages troubleshooting guide. 