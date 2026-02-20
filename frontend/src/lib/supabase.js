import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkmgvkcxiawamtiwviaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbWd2a2N4aWF3YW10aXd2aWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDE4NjgsImV4cCI6MjA3ODQxNzg2OH0.ij5Cpd2-W7eRA3p5r8mE853I-_6SJ7ESfiR5CEc4_pE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
