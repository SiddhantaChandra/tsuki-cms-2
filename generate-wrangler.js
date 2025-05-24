#!/usr/bin/env node

// Script to dynamically generate wrangler.toml with environment variables
// This runs during build and can access environment variables from multiple sources

const fs = require('fs');
const path = require('path');

// Function to load environment variables from .env files
function loadEnvFile(envPath) {
  const envVars = {};
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          envVars[key.trim()] = value.trim();
        }
      }
    }
    
    console.log(`📄 Loaded environment variables from ${envPath}`);
  }
  
  return envVars;
}

// Load environment variables from multiple sources (in order of priority)
const localEnv = loadEnvFile('.env.local');
const prodEnv = loadEnvFile('.env.production');
const defaultEnv = loadEnvFile('.env');

// Manual override values (you can modify these directly if needed)
const MANUAL_OVERRIDES = {
  // Uncomment and set these if you want to manually override values:
  // NEXT_PUBLIC_SUPABASE_URL: 'your-supabase-url-here',
  // NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-supabase-anon-key-here',
  // NODE_VERSION: '20'
};

// Get environment variables with fallback priority:
// 1. Manual overrides (highest priority)
// 2. Process environment variables (from Cloudflare or system)
// 3. .env.local
// 4. .env.production  
// 5. .env (lowest priority)
function getEnvVar(key, defaultValue = '') {
  return MANUAL_OVERRIDES[key] || 
         process.env[key] || 
         localEnv[key] || 
         prodEnv[key] || 
         defaultEnv[key] || 
         defaultValue;
}

const SUPABASE_URL = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const NODE_VERSION = getEnvVar('NODE_VERSION', '20');

// Debug information
console.log('🔍 Environment Variable Sources Check:');
console.log(`- Process env NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}`);
console.log(`- Process env NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}`);
console.log(`- Process env NODE_VERSION: ${process.env.NODE_VERSION ? 'Set' : 'Not set'}`);
console.log(`- .env files checked: .env.local, .env.production, .env`);
console.log(`- Manual overrides active: ${Object.keys(MANUAL_OVERRIDES).length > 0 ? 'Yes' : 'No'}`);
console.log('');  // Empty line for readability

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
  
  // Show source of each variable
  console.log('\n📋 Variable Sources:');
  console.log(`- NODE_VERSION: ${getVariableSource('NODE_VERSION')}`);
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${getVariableSource('NEXT_PUBLIC_SUPABASE_URL')}`);
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${getVariableSource('NEXT_PUBLIC_SUPABASE_ANON_KEY')}`);
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('\n⚠️  Warning: Some environment variables are missing.');
    console.warn('💡 Solutions:');
    console.warn('  1. Set them in Cloudflare Pages dashboard');
    console.warn('  2. Create a .env.local file with your values');
    console.warn('  3. Uncomment and set MANUAL_OVERRIDES in this script');
  }
} catch (error) {
  console.error('❌ Failed to generate wrangler.toml:', error);
  process.exit(1);
}

// Helper function to determine the source of a variable
function getVariableSource(key) {
  if (MANUAL_OVERRIDES[key]) return 'Manual Override';
  if (process.env[key]) return 'Process Environment';
  if (localEnv[key]) return '.env.local';
  if (prodEnv[key]) return '.env.production';
  if (defaultEnv[key]) return '.env';
  return 'Default/Missing';
} 