#!/usr/bin/env node

// Script to dynamically generate wrangler.toml with environment variables
// This runs during build and can access the environment variables from Cloudflare Pages

const fs = require('fs');
const path = require('path');

// Get environment variables from the build process
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const NODE_VERSION = process.env.NODE_VERSION || '20';

// Template for wrangler.toml (without build section as it's not supported by Pages)
const wranglerTomlTemplate = `name = "tsuki-cms-v2"
pages_build_output_dir = "out"

compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

# Environment variables injected during build
[vars]
NODE_VERSION = "${NODE_VERSION}"
NEXT_PUBLIC_SUPABASE_URL = "${SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "${SUPABASE_ANON_KEY}"
`;

// Write the generated wrangler.toml
const wranglerPath = path.join(process.cwd(), 'wrangler.toml');

try {
  fs.writeFileSync(wranglerPath, wranglerTomlTemplate);
  console.log('✅ Generated wrangler.toml with environment variables');
  console.log('Variables included:');
  console.log(`- NODE_VERSION: ${NODE_VERSION}`);
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? 'Set' : 'Missing'}`);
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? 'Set' : 'Missing'}`);
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️  Warning: Some environment variables are missing. Make sure they are set in Cloudflare Pages dashboard.');
  }
} catch (error) {
  console.error('❌ Failed to generate wrangler.toml:', error);
  process.exit(1);
} 