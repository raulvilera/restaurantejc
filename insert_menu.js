
const menuItems = [
    // REFEIÇÕES
    { name: 'SELF SERVICE', price: 26.90, description: 'Sirva-se à vontade', category: 'Refeições' },
    { name: 'PRATO FEITO 1', price: 20.00, description: 'Monte seu prato com 1 opção de proteína', category: 'Refeições' },
    { name: 'PRATO FEITO 2', price: 22.00, description: 'Monte seu prato com 2 opções de proteína', category: 'Refeições' },
    { name: 'PRATO FEITO 3', price: 26.00, description: 'Monte seu prato com 3 opções de proteína', category: 'Refeições' },
    { name: 'PRATO FEITO FEIJOADA', price: 22.00, description: 'Monte seu prato de feijoada (Quarta-feira e Sábado)', category: 'Refeições' },
    { name: 'PRATO FEITO FEIJOADA E BISTECA', price: 24.00, description: 'Monte seu prato de feijoada com 1 bisteca (Quarta-feira e Sábado)', category: 'Refeições' },

    // PARA LEVAR
    { name: 'MARMITA 1', price: 20.00, description: 'Arroz, feijão, acompanhamento e 1 proteína (acompanha salada)', category: 'Para Levar' },
    { name: 'MARMITA 2', price: 22.00, description: 'Arroz, feijão, acompanhamento e 2 proteínas (acompanha salada)', category: 'Para Levar' },
    { name: 'FEIJOADA PP', price: 22.00, description: 'Feijoada, arroz, couve, farofa, torresmo (tudo em uma marmita)', category: 'Para Levar' },
    { name: 'FEIJOADA P', price: 40.00, description: 'Serve 1 pessoa. Feijoada, arroz, couve, farofa, torresmo e 1 bisteca', category: 'Para Levar' },
    { name: 'FEIJOADA M', price: 50.00, description: 'Serve 2 pessoas. Feijoada, arroz, couve, farofa, torresmo e 2 bistecas', category: 'Para Levar' },
    { name: 'FEIJOADA G', price: 65.00, description: 'Serve 4 pessoas. Feijoada, arroz, couve, farofa, torresmo e 4 bistecas', category: 'Para Levar' },

    // PORÇÕES
    { name: 'BATATA FRITA P', price: 10.00, description: '', category: 'Porções' },
    { name: 'BATATA FRITA M', price: 15.00, description: '', category: 'Porções' },
    { name: 'BATATA FRITA G', price: 20.00, description: '', category: 'Porções' },
    { name: 'CALABRESA ACEBOLADA', price: 25.00, description: '', category: 'Porções' },
    { name: 'TORRESMO', price: 12.00, description: 'Quarta-feira e Sábado', category: 'Porções' },

    // BEBIDAS
    { name: 'REFRIGERANTE 200ML', price: 4.00, description: '', category: 'Bebidas' },
    { name: 'REFRIGERANTE LATA', price: 7.00, description: '', category: 'Bebidas' },
    { name: 'REFRIGERANTE 600ML', price: 9.00, description: '', category: 'Bebidas' },
    { name: 'REFRIGERANTE 1L', price: 10.00, description: '', category: 'Bebidas' },
    { name: 'REFRIGERANTE 1,5L', price: 10.50, description: '', category: 'Bebidas' },
    { name: 'REFRIGERANTE 2L', price: 12.00, description: 'Guaraná, Sukita, Pepsi', category: 'Bebidas' },
    { name: 'COCA-COLA 2L', price: 15.00, description: '', category: 'Bebidas' },
    { name: 'SUCO NATURAL', price: 9.00, description: 'Consultar opções disponíveis', category: 'Bebidas' },
    { name: 'SUCO NATURAL C/LEITE', price: 11.00, description: 'Consultar opções disponíveis', category: 'Bebidas' },
    { name: 'SUCO NATURAL JARRA 1L', price: 26.00, description: 'Consultar opções disponíveis', category: 'Bebidas' },
    { name: 'SUCO NATURAL C/LEITE JARRA 1L', price: 27.00, description: 'Consultar opções disponíveis', category: 'Bebidas' },
    { name: 'ÁGUA', price: 4.00, description: '', category: 'Bebidas' },
    { name: 'ÁGUA 1,5L', price: 7.00, description: '', category: 'Bebidas' },

    // CERVEJAS
    { name: 'SKOL 350ML', price: 6.00, description: '', category: 'Cervejas' },
    { name: 'HEINEKEN LONG NECK', price: 9.00, description: '', category: 'Cervejas' },
    { name: 'BRAHMA DUPLO MALTE 350ML', price: 6.00, description: '', category: 'Cervejas' },
    { name: 'SKOL 600ML', price: 12.00, description: '', category: 'Cervejas' },
    { name: 'ORIGINAL 600ML', price: 12.00, description: '', category: 'Cervejas' },

    // CAIPIRINHAS
    { name: 'CAIPIRINHA C/ CACHAÇA', price: 11.00, description: 'Consultar opções disponíveis', category: 'Caipirinhas' },
    { name: 'CAIPIRINHA C/ VODKA', price: 16.00, description: 'Consultar opções disponíveis', category: 'Caipirinhas' },

    // SOBREMESAS
    { name: 'MOUSSE', price: 4.00, description: '', category: 'Sobremesas' },
    { name: 'PUDIM', price: 8.00, description: '', category: 'Sobremesas' },
    { name: 'BOLO DE POTE', price: 9.00, description: '', category: 'Sobremesas' },
    { name: 'GELATINA MOSAICO', price: 8.00, description: '', category: 'Sobremesas' },

    // DOSES
    { name: 'YPIÓCA OURO', price: 6.00, description: '', category: 'Doses' },
    { name: 'DREHER', price: 6.00, description: '', category: 'Doses' },
    { name: '51', price: 4.00, description: '', category: 'Doses' },
    { name: 'VELHO BARREIRO', price: 4.00, description: '', category: 'Doses' },
    { name: 'VODKA', price: 6.00, description: '', category: 'Doses' },
    { name: 'CABARÉ PRATA', price: 8.00, description: '', category: 'Doses' },
    { name: 'RED LABEL', price: 11.00, description: '', category: 'Doses' },
    { name: 'BALLANTINE\'S', price: 11.00, description: '', category: 'Doses' },
    { name: 'PITÚ', price: 4.00, description: '', category: 'Doses' }
];

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load env vars
const envFile = 'c:/Users/raul_/Downloads/mjc-restaurante-admin (1)/.env.local';
const envConfig = dotenv.parse(fs.readFileSync(envFile));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertMenu() {
    console.log('Iniciando inserção do cardápio...');

    // Limpar itens existentes para evitar duplicatas se necessário, ou apenas inserir
    // Vamos apenas inserir. Se houver erro de PK (UUID), ele gera novo.

    for (const item of menuItems) {
        const { data, error } = await supabase
            .from('menu_items')
            .insert([
                {
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    category: item.category,
                    active: true,
                    image: 'https://picsum.photos/seed/' + Math.random() + '/400/300'
                }
            ]);

        if (error) {
            console.error(`Erro ao inserir ${item.name}:`, error.message);
        } else {
            console.log(`Inserido: ${item.name}`);
        }
    }
}

insertMenu();
