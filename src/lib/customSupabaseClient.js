import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwwyddsfrwkrvbjboqdc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3lkZHNmcndrcnZiamJvcWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDY5MTAsImV4cCI6MjA3MTc4MjkxMH0.Sj5IBl4bvCYAjallDLrv6HZVwmG_PaFZZqfxEuAWpyE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);