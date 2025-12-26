import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlulgwssiwndqtkgccpn.supabase.co';
const supabaseAnonKey = 'sb_publishable_mPNqRlUqtVWrsDssuSIYoA_krEiP2Mt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);