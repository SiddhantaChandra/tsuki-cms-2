// Debug script to check environment variables during Cloudflare build
console.log('🔍 Environment Variables Debug:');
console.log('NODE_VERSION:', process.env.NODE_VERSION || 'Missing ❌');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌');
console.log('Node.js version:', process.version);
console.log('');
console.log('🔧 Available environment variables:');
Object.keys(process.env)
  .filter(key => key.includes('SUPABASE') || key.includes('NODE') || key.includes('NEXT'))
  .forEach(key => console.log(`  ${key}: ${process.env[key] ? 'Set' : 'Missing'}`)); 