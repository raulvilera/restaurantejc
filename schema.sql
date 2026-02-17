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
('Prato Feito 1', 20.00, 'Monte seu prato com 1 opção de proteína, arroz, feijão e salada.', 'Refeições', true, 'https://picsum.photos/seed/pf1/400/300'),
('Self Service', 26.90, 'Sirva-se à vontade no nosso buffet variado.', 'Refeições', true, 'https://picsum.photos/seed/self/400/300'),
('Batata Frita G', 20.00, 'Porção generosa de batatas crocantes sequinhas.', 'Porções', true, 'https://picsum.photos/seed/fries/400/300'),
('Mousse Especial', 4.00, 'Sobremesa artesanal de chocolate gourmet.', 'Sobremesas', false, 'https://picsum.photos/seed/mousse/400/300')
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
