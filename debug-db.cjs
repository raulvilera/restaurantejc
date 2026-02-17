
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar .env.local manualmente
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos.');
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

    console.log(`Sucesso: Encontrados ${data.length} itens.`);

    data.forEach((item) => {
        console.log(`- [${item.active ? 'ATIVO' : 'INATIVO'}] "${item.name}" | Categoria: "${item.category}"`);
    });

    const categories = [...new Set(data.map(i => i.category))];
    console.log('\nCategorias únicas no banco:', categories);
}

debugItems();
