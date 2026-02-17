
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos em .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugItems() {
    console.log('--- BUSCANDO ITENS DO MENU ---');
    const { data, error } = await supabase
        .from('menu_items')
        .select('*');

    if (error) {
        console.error('Erro ao buscar itens:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('AVISO: Nenhum item encontrado na tabela menu_items.');
        return;
    }

    console.log(`Sucesso: Encontrados ${data.length} itens.`);

    const categoriesCount: Record<string, number> = {};
    data.forEach((item: any) => {
        console.log(`- Item: "${item.name}" | Categoria: "${item.category}" | Ativo: ${item.active}`);
        categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;
    });

    console.log('\n--- RESUMO DE CATEGORIAS NO BANCO ---');
    Object.entries(categoriesCount).forEach(([cat, count]) => {
        console.log(`${cat}: ${count} itens`);
    });
}

debugItems();
