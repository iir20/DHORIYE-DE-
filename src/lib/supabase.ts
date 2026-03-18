import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase Init] URL:', supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'MISSING');
console.log('[Supabase Init] Key Length:', supabaseAnonKey ? supabaseAnonKey.length : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.error('[Supabase Init] CRITICAL: Supabase URL or Key is missing or invalid!');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

console.log('[Supabase Init] Client created');
