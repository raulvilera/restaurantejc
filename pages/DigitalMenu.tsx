
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';

const DigitalMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('Refeições');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const categories = ['Refeições', 'Para Levar', 'Porções', 'Bebidas', 'Sobremesas'];
    const adminLinks = [
        { name: 'Painel Geral', path: '/admin', icon: 'dashboard' },
        { name: 'Meus Pedidos', path: '/admin/orders', icon: 'shopping_basket' },
        { name: 'Gerenciar Menu', path: '/admin/menu', icon: 'restaurant_menu' },
        { name: 'Meus Clientes', path: '/admin/customers', icon: 'group' },
        { name: 'Configurações', path: '/admin/settings', icon: 'settings' },
    ];

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('menu_items')
                    .select('*')
                    .eq('active', true)
                    .order('name');

                if (error) throw error;
                setMenuItems(data || []);
            } catch (err) {
                console.error('Erro ao carregar cardápio:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const itemsByCategory = (category: string) => {
        return menuItems.filter(item => item.category === category);
    };

    const handleCategoryClick = (cat: string) => {
        setActiveCategory(cat);
        // Removemos o scroll para manter o banner estático
    };

    const renderRefeicoes = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {itemsByCategory('Refeições').map((item) => (
                <div key={item.id} className="p-4 border border-red-600/10 rounded-2xl bg-white shadow-sm hover:border-red-600/30 transition-all flex flex-col justify-center min-h-[110px]">
                    <h3 className="font-bold text-[#181111] text-xs uppercase leading-tight mb-2">{item.name}</h3>
                    <p className="text-red-600 font-black text-lg tracking-tighter">
                        {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            ))}
        </div>
    );

    const renderParaLevar = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {itemsByCategory('Para Levar').map((item) => (
                <div key={item.id} className="p-4 border border-red-600/10 rounded-2xl bg-white shadow-sm hover:border-red-600/30 transition-all flex flex-col justify-center min-h-[110px]">
                    <h3 className="font-bold text-[#181111] text-xs uppercase leading-tight mb-2">{item.name}</h3>
                    <p className="text-red-600 font-black text-lg tracking-tighter">
                        {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            ))}
        </div>
    );

    const renderPorcoes = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {itemsByCategory('Porções').map((item) => (
                <div key={item.id} className="p-4 border border-red-600/10 rounded-2xl bg-white shadow-sm hover:border-red-600/30 transition-all flex flex-col justify-center min-h-[110px]">
                    <h3 className="font-bold text-[#181111] text-xs uppercase leading-tight mb-2">{item.name}</h3>
                    <p className="text-red-600 font-black text-lg tracking-tighter">
                        {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            ))}
        </div>
    );

    const renderBebidas = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {itemsByCategory('Bebidas').map((item) => (
                <div key={item.id} className="p-4 border border-red-600/10 rounded-2xl bg-white shadow-sm hover:border-red-600/30 transition-all flex flex-col justify-center min-h-[110px]">
                    <h3 className="font-bold text-[#181111] text-xs uppercase leading-tight mb-2">{item.name}</h3>
                    <p className="text-red-600 font-black text-lg tracking-tighter">
                        {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            ))}
        </div>
    );

    const renderSobremesas = () => (
        <div className="grid grid-cols-2 gap-4 px-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {itemsByCategory('Sobremesas').map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center flex items-center justify-center min-h-[80px]">
                    <h3 className="font-black digital-menu-text-dark text-sm uppercase">{item.name}</h3>
                </div>
            ))}
        </div>
    );

    const bannerImages = [
        "/banner/banner1.png",
        "/banner/banner2.png",
        "/banner/banner3.png",
        "/banner/banner4.png",
        "/banner/banner5.png",
    ];

    return (
        <div className="min-h-screen bg-white pb-32 overflow-x-hidden relative">
            {/* Botão Hamburger Menu */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 active:scale-95 transition-all text-red-600"
            >
                <span className="material-symbols-outlined text-3xl font-bold">menu</span>
            </button>

            {/* Backdrop do Menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}

            {/* Drawer Lateral */}
            <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#0b0f1a] z-[70] shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header do Menu */}
                    <div className="p-8 border-b border-white/5 flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-lg mb-4 rotate-3">
                            <span className="material-symbols-outlined text-white text-4xl">restaurant</span>
                        </div>
                        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">JC Restaurantes</h2>
                        <p className="text-[10px] text-red-500 font-bold tracking-[0.3em] mt-1">SISTEMA ADMIN</p>
                    </div>

                    {/* Links de Navegação */}
                    <nav className="flex-1 p-6 space-y-2 mt-4">
                        {adminLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className={`material-symbols-outlined text-2xl group-hover:text-red-600 transition-colors`}>{link.icon}</span>
                                <span className="font-bold text-sm tracking-tight">{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer do Menu */}
                    <div className="p-8 border-t border-white/5">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full bg-red-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                            FECHAR MENU
                        </button>
                    </div>
                </div>
            </div>

            {/* Header Banner - CARROSSEL INFINITO */}
            <div className="relative h-[480px] w-full overflow-hidden bg-slate-900">
                <div className="animate-carousel-banner h-full">
                    {/* Duplicamos as imagens para o loop infinito ser perfeito */}
                    {[...bannerImages, ...bannerImages].map((img, index) => (
                        <div key={index} className="h-full min-w-full sm:min-w-[50%] lg:min-w-[33.33%] relative">
                            <img
                                src={img}
                                alt={`Slide ${index}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Overlay do banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-black/20 to-transparent pointer-events-none"></div>

                {/* Restaurant Info */}
                <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 text-center text-white text-shadow-lg z-10 pointer-events-none px-6">
                    <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)] uppercase italic leading-none">
                        JC Restaurantes
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="h-[2px] w-8 bg-red-600"></span>
                        <p className="text-sm opacity-95 text-white font-black drop-shadow-lg uppercase tracking-[0.2em]">
                            Jd das Camélias, SP
                        </p>
                        <span className="h-[2px] w-8 bg-red-600"></span>
                    </div>
                </div>
            </div>

            {/* Main Content Immediately Below the Banner */}
            <div className="relative z-20 bg-white px-4 pt-6 min-h-screen">

                {/* Categories Navigation - STICKY AT TOP */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md -mx-4 px-4 pb-4 pt-4 border-b border-red-600/10">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${activeCategory === cat
                                    ? 'bg-red-600 text-white border-red-600 scale-105'
                                    : 'bg-red-600/10 text-red-600 border-transparent'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Category Title */}
                <div className="mt-8 mb-6 border-b-2 border-red-600/10 pb-2 flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-600 text-3xl font-light">
                        {activeCategory === 'Refeições' ? 'restaurant' :
                            activeCategory === 'Para Levar' ? 'takeout_dining' :
                                activeCategory === 'Porções' ? 'bakery_dining' :
                                    activeCategory === 'Bebidas' ? 'local_bar' : 'icecream'}
                    </span>
                    <h2 className="text-2xl font-black text-[#181111] tracking-tighter uppercase italic">
                        {activeCategory}
                    </h2>
                </div>

                {/* Tab Content Rendering */}
                <div className="transition-all duration-500 pb-20">
                    {activeCategory === 'Refeições' && renderRefeicoes()}
                    {activeCategory === 'Para Levar' && renderParaLevar()}
                    {activeCategory === 'Porções' && renderPorcoes()}
                    {activeCategory === 'Bebidas' && renderBebidas()}
                    {activeCategory === 'Sobremesas' && renderSobremesas()}
                </div>
            </div>

            {/* Footer Info Dark */}
            <footer className="bg-[#0b0f1a] text-white p-12 pb-44 border-t-8 border-red-600">
                <h2 className="text-3xl font-black text-red-600 text-center mb-12 tracking-tighter uppercase italic drop-shadow-sm">JC Restaurantes</h2>
                <div className="space-y-10 max-w-sm mx-auto">
                    <div className="flex items-start gap-6 group">
                        <div className="bg-red-600/10 p-4 rounded-2xl border border-red-600/20 group-hover:bg-red-600 transition-all">
                            <span className="material-symbols-outlined text-red-600 group-hover:text-white text-3xl">call</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-1">Contatos</p>
                            <div className="space-y-1">
                                <p className="text-xl font-bold text-white">(11) 5197-0399</p>
                                <p className="text-xl font-bold text-white">(11) 99784-9852</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                        <div className="bg-red-600/10 p-4 rounded-2xl border border-red-600/20 group-hover:bg-red-600 transition-all">
                            <span className="material-symbols-outlined text-red-600 group-hover:text-white text-3xl">location_on</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-1">Endereço</p>
                            <p className="text-base font-bold leading-relaxed text-white">
                                Av. Laranja da China 275 - Jd das Camélias
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-600 font-bold mt-20 uppercase tracking-widest">
                    © 2024 JC Restaurantes. Todos os direitos reservados.
                </p>
            </footer>

            {/* Floating Cart Button */}
            <button className="fixed bottom-28 right-6 bg-red-600 text-white p-5 rounded-full shadow-[0_15px_30px_-5px_rgba(220,38,38,0.5)] z-50 transform transition-all active:scale-90 border-4 border-white">
                <span className="material-symbols-outlined text-3xl text-white">shopping_cart</span>
            </button>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-12 py-5 flex justify-between items-center z-40 backdrop-blur-lg bg-white/95">
                <button className="flex flex-col items-center gap-1 text-red-600">
                    <span className="material-symbols-outlined fill text-3xl">menu_book</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Cardápio</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 text-slate-400">
                    <span className="material-symbols-outlined text-3xl">map</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Mapa</span>
                </button>
            </div>
        </div>
    );
};

export default DigitalMenu;
