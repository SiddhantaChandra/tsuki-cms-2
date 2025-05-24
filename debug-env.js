// Debug script to check environment variables during Cloudflare build
console.log('🔍 Environment Variables Debug - Build Time:');
console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('NODE_VERSION:', process.env.NODE_VERSION || 'Missing ❌');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌');
console.log('Node.js version:', process.version);
console.log('');
console.log('🔧 All environment variables containing relevant keywords:');
Object.keys(process.env)
  .filter(key => 
    key.includes('SUPABASE') || 
    key.includes('NODE') || 
    key.includes('NEXT') ||
    key.includes('CF') ||
    key.includes('CLOUDFLARE') ||
    key.includes('PAGES')
  )
  .sort()
  .forEach(key => {
    const value = process.env[key];
    const displayValue = value && value.length > 20 ? 
      `${value.substring(0, 20)}...` : 
      (value || 'Missing');
    console.log(`  ${key}: ${displayValue}`);
  });

console.log('');
console.log('🌐 Total environment variables:', Object.keys(process.env).length); 