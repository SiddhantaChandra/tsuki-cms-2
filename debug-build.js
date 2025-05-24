#!/usr/bin/env node

console.log('🔍 DEBUG: Environment Variables During Build Process');
console.log('═'.repeat(80));
console.log();

// Check NODE environment
console.log('📋 Node.js Information:');
console.log(`- Node Version: ${process.version}`);
console.log(`- Platform: ${process.platform}`);
console.log(`- Architecture: ${process.arch}`);
console.log();

// Show all environment variables
console.log('🌐 Environment Variables:');
console.log('-'.repeat(50));

// Get all env vars and sort them
const envVars = Object.keys(process.env).sort();

// Filter and categorize
const nextVars = envVars.filter(key => key.startsWith('NEXT_'));
const supabaseVars = envVars.filter(key => key.includes('SUPABASE'));
const cloudflareVars = envVars.filter(key => key.includes('CLOUDFLARE') || key.includes('CF_'));
const nodeVars = envVars.filter(key => key.startsWith('NODE_'));
const vercelVars = envVars.filter(key => key.startsWith('VERCEL_'));

console.log('📦 Next.js Variables:');
if (nextVars.length > 0) {
  nextVars.forEach(key => {
    const value = process.env[key];
    // Only show first/last few chars for security
    const displayValue = value && value.length > 20 
      ? `${value.substring(0, 8)}...${value.substring(value.length - 8)}`
      : value;
    console.log(`  ${key}: ${displayValue || 'NOT SET'}`);
  });
} else {
  console.log('  No Next.js variables found');
}

console.log();
console.log('🔐 Supabase Variables:');
if (supabaseVars.length > 0) {
  supabaseVars.forEach(key => {
    const value = process.env[key];
    const displayValue = value && value.length > 20 
      ? `${value.substring(0, 8)}...${value.substring(value.length - 8)}`
      : value;
    console.log(`  ${key}: ${displayValue || 'NOT SET'}`);
  });
} else {
  console.log('  No Supabase variables found');
}

console.log();
console.log('☁️ Cloudflare Variables:');
if (cloudflareVars.length > 0) {
  cloudflareVars.forEach(key => {
    console.log(`  ${key}: ${process.env[key] || 'NOT SET'}`);
  });
} else {
  console.log('  No Cloudflare variables found');
}

console.log();
console.log('⚙️ Node Variables:');
if (nodeVars.length > 0) {
  nodeVars.forEach(key => {
    console.log(`  ${key}: ${process.env[key] || 'NOT SET'}`);
  });
} else {
  console.log('  No Node variables found');
}

console.log();
console.log('🔧 Vercel Variables:');
if (vercelVars.length > 0) {
  vercelVars.forEach(key => {
    console.log(`  ${key}: ${process.env[key] || 'NOT SET'}`);
  });
} else {
  console.log('  No Vercel variables found');
}

console.log();
console.log('🎯 Critical Variables Status:');
console.log('-'.repeat(30));

const criticalVars = [
  'NODE_VERSION',
  'NEXT_PUBLIC_SUPABASE_URL', 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NODE_ENV'
];

criticalVars.forEach(key => {
  const value = process.env[key];
  const status = value ? '✅ SET' : '❌ MISSING';
  console.log(`  ${key}: ${status}`);
  if (value && key.includes('SUPABASE') && value.length > 20) {
    console.log(`    └─ Value: ${value.substring(0, 8)}...${value.substring(value.length - 8)}`);
  } else if (value) {
    console.log(`    └─ Value: ${value}`);
  }
});

console.log();
console.log('═'.repeat(80));
console.log(); 