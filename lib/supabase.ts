import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'SEU_SUPABASE_URL' || supabaseAnonKey === 'SUA_SUPABASE_ANON_KEY') {
  console.error('ERRO: Credenciais do Supabase não configuradas corretamente no arquivo .env.local');
  console.warn('Por favor, substitua SEU_SUPABASE_URL e SUA_SUPABASE_ANON_KEY pelas suas credenciais reais.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
