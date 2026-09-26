import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

// Check if valid keys are provided (not placeholders)
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== '' && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabaseAnonKey.trim() !== '' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    'Supabase environment variables not fully configured. Falling back to local storage engine for full landing page and admin portal preview.'
  );
}
