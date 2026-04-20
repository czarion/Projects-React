import { createClient } from '@supabase/supabase-js';

// We fallback to placeholders to prevent the app from crashing on boot,
// but API calls will fail if these are not real values.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
