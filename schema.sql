-- Script de Criação de Tabelas para MJC Restaurante

-- Habilitar a extensão uuid-ossp se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Itens do Menu
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact TEXT,
    last_order DATE,
    total_spent DECIMAL(10,2) DEFAULT 0,
    initials TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- Usando o formato #0000 como no sistema atual
    customer_name TEXT NOT NULL,
    customer_initial TEXT,
    items TEXT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL,
    order_time TEXT, -- Guardando como string conforme o mockup "Há X minutos"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir Dados Iniciais (Menu)
INSERT INTO public.menu_items (name, price, description, category, active, image) 
VALUES 
('SELF SERVICE', 26.90, 'Sirva-se à vontade', 'Refeições', true, 'https://picsum.photos/seed/self/400/300'),
('PRATO FEITO 1', 20.00, 'Monte seu prato com 1 opção de proteína', 'Refeições', true, 'https://picsum.photos/seed/pf1/400/300'),
('PRATO FEITO 2', 22.00, 'Monte seu prato com 2 opções de proteína', 'Refeições', true, 'https://picsum.photos/seed/pf2/400/300'),
('PRATO FEITO 3', 26.00, 'Monte seu prato com 3 opções de proteína', 'Refeições', true, 'https://picsum.photos/seed/pf3/400/300'),
('PRATO FEITO FEIJOADA', 22.00, 'Monte seu prato de feijoada (Quarta-feira e Sábado)', 'Refeições', true, 'https://picsum.photos/seed/feij/400/300'),
('PRATO FEITO FEIJOADA E BISTECA', 24.00, 'Monte seu prato de feijoada com 1 bisteca (Quarta-feira e Sábado)', 'Refeições', true, 'https://picsum.photos/seed/feijb/400/300'),
('MARMITA 1', 20.00, 'Arroz, feijão, acompanhamento e 1 proteína (acompanha salada)', 'Para Levar', true, 'https://picsum.photos/seed/m1/400/300'),
('MARMITA 2', 22.00, 'Arroz, feijão, acompanhamento e 2 proteínas (acompanha salada)', 'Para Levar', true, 'https://picsum.photos/seed/m2/400/300'),
('FEIJOADA PP', 22.00, 'Feijoada, arroz, couve, farofa, torresmo (tudo em uma marmita)', 'Para Levar', true, 'https://picsum.photos/seed/fpp/400/300'),
('FEIJOADA P', 40.00, 'Serve 1 pessoa. Feijoada, arroz, couve, farofa, torresmo e 1 bisteca', 'Para Levar', true, 'https://picsum.photos/seed/fp/400/300'),
('FEIJOADA M', 50.00, 'Serve 2 pessoas. Feijoada, arroz, couve, farofa, torresmo e 2 bistecas', 'Para Levar', true, 'https://picsum.photos/seed/fm/400/300'),
('FEIJOADA G', 65.00, 'Serve 4 pessoas. Feijoada, arroz, couve, farofa, torresmo e 4 bistecas', 'Para Levar', true, 'https://picsum.photos/seed/fg/400/300'),
('BATATA FRITA P', 10.00, '', 'Porções', true, 'https://picsum.photos/seed/bfp/400/300'),
('BATATA FRITA M', 15.00, '', 'Porções', true, 'https://picsum.photos/seed/bfm/400/300'),
('BATATA FRITA G', 20.00, '', 'Porções', true, 'https://picsum.photos/seed/bfg/400/300'),
('CALABRESA ACEBOLADA', 25.00, '', 'Porções', true, 'https://picsum.photos/seed/cala/400/300'),
('TORRESMO', 12.00, 'Quarta-feira e Sábado', 'Porções', true, 'https://picsum.photos/seed/torr/400/300'),
('REFRIGERANTE 200ML', 4.00, '', 'Bebidas', true, 'https://picsum.photos/seed/ref2/400/300'),
('REFRIGERANTE LATA', 7.00, '', 'Bebidas', true, 'https://picsum.photos/seed/refl/400/300'),
('REFRIGERANTE 600ML', 9.00, '', 'Bebidas', true, 'https://picsum.photos/seed/ref6/400/300'),
('REFRIGERANTE 1L', 10.00, '', 'Bebidas', true, 'https://picsum.photos/seed/ref1/400/300'),
('REFRIGERANTE 1,5L', 10.50, '', 'Bebidas', true, 'https://picsum.photos/seed/ref15/400/300'),
('REFRIGERANTE 2L', 12.00, 'Guaraná, Sukita, Pepsi', 'Bebidas', true, 'https://picsum.photos/seed/ref2l/400/300'),
('COCA-COLA 2L', 15.00, '', 'Bebidas', true, 'https://picsum.photos/seed/coca/400/300'),
('SUCO NATURAL', 9.00, 'Consultar opções disponíveis', 'Bebidas', true, 'https://picsum.photos/seed/suco/400/300'),
('SUCO NATURAL C/LEITE', 11.00, 'Consultar opções disponíveis', 'Bebidas', true, 'https://picsum.photos/seed/sucol/400/300'),
('SUCO NATURAL JARRA 1L', 26.00, 'Consultar opções disponíveis', 'Bebidas', true, 'https://picsum.photos/seed/sucoj/400/300'),
('SUCO NATURAL C/LEITE JARRA 1L', 27.00, 'Consultar opções disponíveis', 'Bebidas', true, 'https://picsum.photos/seed/sucolj/400/300'),
('ÁGUA', 4.00, '', 'Bebidas', true, 'https://picsum.photos/seed/agua/400/300'),
('ÁGUA 1,5L', 7.00, '', 'Bebidas', true, 'https://picsum.photos/seed/agua15/400/300'),
('SKOL 350ML', 6.00, '', 'Cervejas', true, 'https://picsum.photos/seed/skol/400/300'),
('HEINEKEN LONG NECK', 9.00, '', 'Cervejas', true, 'https://picsum.photos/seed/hein/400/300'),
('BRAHMA DUPLO MALTE 350ML', 6.00, '', 'Cervejas', true, 'https://picsum.photos/seed/brah/400/300'),
('SKOL 600ML', 12.00, '', 'Cervejas', true, 'https://picsum.photos/seed/skol6/400/300'),
('ORIGINAL 600ML', 12.00, '', 'Cervejas', true, 'https://picsum.photos/seed/orig/400/300'),
('CAIPIRINHA C/ CACHAÇA', 11.00, 'Consultar opções disponíveis', 'Caipirinhas', true, 'https://picsum.photos/seed/caipc/400/300'),
('CAIPIRINHA C/ VODKA', 16.00, 'Consultar opções disponíveis', 'Caipirinhas', true, 'https://picsum.photos/seed/caipv/400/300'),
('MOUSSE', 4.00, '', 'Sobremesas', true, 'https://picsum.photos/seed/mousse/400/300'),
('PUDIM', 8.00, '', 'Sobremesas', true, 'https://picsum.photos/seed/pudim/400/300'),
('BOLO DE POTE', 9.00, '', 'Sobremesas', true, 'https://picsum.photos/seed/bolo/400/300'),
('GELATINA MOSAICO', 8.00, '', 'Sobremesas', true, 'https://picsum.photos/seed/gela/400/300'),
('YPIÓCA OURO', 6.00, '', 'Doses', true, 'https://picsum.photos/seed/ypi/400/300'),
('DREHER', 6.00, '', 'Doses', true, 'https://picsum.photos/seed/dre/400/300'),
('51', 4.00, '', 'Doses', true, 'https://picsum.photos/seed/51/400/300'),
('VELHO BARREIRO', 4.00, '', 'Doses', true, 'https://picsum.photos/seed/velho/400/300'),
('VODKA', 6.00, '', 'Doses', true, 'https://picsum.photos/seed/vodk/400/300'),
('CABARÉ PRATA', 8.00, '', 'Doses', true, 'https://picsum.photos/seed/caba/400/300'),
('RED LABEL', 11.00, '', 'Doses', true, 'https://picsum.photos/seed/red/400/300'),
('BALLANTINE\'S', 11.00, '', 'Doses', true, 'https://picsum.photos/seed/ball/400/300'),
('PITÚ', 4.00, '', 'Doses', true, 'https://picsum.photos/seed/pitu/400/300')
ON CONFLICT DO NOTHING;

-- Inserir Dados Iniciais (Clientes)
INSERT INTO public.customers (name, contact, last_order, total_spent, initials)
VALUES
('João Silva', '(11) 99999-9999', '2023-10-12', 450.00, 'JS'),
('Maria Oliveira', '(21) 98888-8888', '2023-10-10', 320.50, 'MO'),
('Carlos Souza', '(31) 97777-7777', '2023-10-05', 1150.00, 'CS'),
('Ana Costa', '(41) 96666-6666', '2023-10-01', 89.90, 'AC')
ON CONFLICT DO NOTHING;

-- Inserir Dados Iniciais (Pedidos)
INSERT INTO public.orders (id, customer_name, customer_initial, items, total, status, order_time)
VALUES
('#0458', 'Ricardo Camargo', 'RC', '2x Burger Gourmet, 1x Batata Rústica, 1x Coca-Cola', 124.90, 'PENDENTE', 'Há 5 minutos'),
('#0457', 'Mariana Silva', 'MS', '1x Pizza Família Margherita, 2x Suco Natural', 89.00, 'EM PREPARO', 'Há 12 minutos'),
('#0456', 'André Duarte', 'AD', '3x Temaki Salmão, 1x Combinado 20 peças', 156.50, 'CONCLUÍDO', 'Há 25 minutos'),
('#0455', 'Lúcia Ferreira', 'LF', '1x Risoto de Alho Poró, 1x Vinho Tinto', 112.00, 'EM PREPARO', 'Há 40 minutos')
ON CONFLICT DO NOTHING;
