
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';

const DigitalMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('Refeições');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ['Refeições', 'Para Levar', 'Porções', 'Bebidas', 'Sobremesas'];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {itemsByCategory('Refeições').map((item) => {
                const isFeatured = item.description?.toLowerCase().includes('wed & sat') || item.name.toLowerCase().includes('feijoada');
                return (
                    <div key={item.id} className={`flex flex-col justify-between p-5 rounded-2xl transition-all h-full ${isFeatured ? 'bg-red-50/40 border-l-[6px] border-red-600 shadow-sm' : 'bg-white border border-slate-50 shadow-sm'}`}>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold digital-menu-text-dark text-lg leading-tight uppercase tracking-tight flex-1">{item.name}</h3>
                                <span className="digital-menu-text-red font-black text-xl tracking-tighter whitespace-nowrap">
                                    {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            {isFeatured && <span className="inline-block bg-red-600 text-[8px] text-white font-black px-1.5 py-0.5 rounded-sm uppercase italic tracking-tighter mb-2">WED & SAT</span>}
                            <p className="text-xs digital-menu-text-gray font-medium leading-relaxed italic opacity-75">{item.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderParaLevar = () => {
        const marmitas = itemsByCategory('Para Levar').filter(i => i.name.toLowerCase().includes('marmita'));
        const feijoadas = itemsByCategory('Para Levar').filter(i => i.name.toLowerCase().includes('feijoada'));

        return (
            <div className="space-y-6 px-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {marmitas.map(item => (
                        <div key={item.id} className="flex justify-between items-center gap-4 p-5 rounded-2xl bg-white border border-slate-50 shadow-sm">
                            <h3 className="font-bold digital-menu-text-dark text-lg uppercase tracking-tight">{item.name}</h3>
                            <span className="digital-menu-text-red font-black text-xl tracking-tighter">{item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ))}
                </div>

                {feijoadas.length > 0 && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 border-l-[6px] border-red-600">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-red-600 text-sm">star</span>
                            <h3 className="font-black text-red-600 text-lg uppercase italic tracking-tighter">Feijoada Completa</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {feijoadas.sort((a, b) => a.price - b.price).map(item => {
                                const sizeMatch = item.name.match(/\(([^)]+)\)/) || item.name.match(/\s(PP|P|M|G)$/);
                                const size = sizeMatch ? sizeMatch[1] : item.name.split(' ').pop();
                                const label = item.name.includes('PP') ? 'Extra Small' : item.name.includes(' P') ? 'Small' : item.name.includes(' M') ? 'Medium' : 'Large';
                                return (
                                    <div key={item.id} className="flex flex-col">
                                        <p className="text-[10px] font-black digital-menu-text-gray uppercase mb-1">{label} ({size})</p>
                                        <p className="text-xl font-black digital-menu-text-dark tracking-tighter">{item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderPorcoes = () => {
        const batatas = itemsByCategory('Porções').filter(i => i.name.toLowerCase().includes('batata'));
        const outras = itemsByCategory('Porções').filter(i => !i.name.toLowerCase().includes('batata'));

        return (
            <div className="space-y-6 px-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 bg-red-50/20">
                    <h3 className="font-black digital-menu-text-dark text-lg mb-4 uppercase tracking-tight">Batata Frita</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {batatas.sort((a, b) => a.price - b.price).map(item => {
                            const size = item.name.includes(' P') || item.name.includes('PEQUENA') ? 'PEQUENA' : item.name.includes(' M') || item.name.includes('MÉDIA') ? 'MÉDIA' : 'GRANDE';
                            return (
                                <div key={item.id} className="bg-white p-3 rounded-xl border border-red-100 text-center shadow-sm">
                                    <p className="text-[8px] font-black digital-menu-text-gray uppercase mb-1">{size}</p>
                                    <p className="text-sm font-black digital-menu-text-red tracking-tighter">{item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {outras.map(item => (
                        <div key={item.id} className="flex justify-between items-center gap-4 p-5 rounded-2xl bg-white border border-slate-50 shadow-sm">
                            <h3 className="font-bold digital-menu-text-dark text-lg uppercase tracking-tight">{item.name}</h3>
                            <span className="digital-menu-text-red font-black text-xl tracking-tighter">{item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderBebidas = () => {
        const drinks = itemsByCategory('Bebidas');
        const subCategories = {
            'PRINCIPAIS': drinks.filter(i => i.name.includes('2L') || i.name.includes('NATURAL')),
            'REFRIGERANTES': ['Lata', '600ml', '1L', '1.5L', '2L'],
            'CERVEJAS': ['Skol', 'Heineken', 'Brahma']
        };

        return (
            <div className="space-y-8 px-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subCategories.PRINCIPAIS.map(item => (
                        <div key={item.id} className="flex justify-between items-center gap-4 p-5 rounded-2xl bg-white border border-slate-50 shadow-sm">
                            <div className="flex-1">
                                <h3 className="font-bold digital-menu-text-dark text-lg uppercase tracking-tight">{item.name}</h3>
                                {item.name.includes('2L') && <p className="text-[10px] digital-menu-text-gray italic font-medium mt-1">Perfect for sharing</p>}
                                {item.name.includes('NATURAL') && <p className="text-[10px] digital-menu-text-gray italic font-medium mt-1">Fresh seasonal fruits</p>}
                            </div>
                            <span className="digital-menu-text-red font-black text-xl tracking-tighter">{item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black digital-menu-text-gray uppercase tracking-widest border-b border-slate-100 pb-1">Refrigerantes</p>
                    <p className="text-xs digital-menu-text-gray font-bold italic opacity-70">Lata, 600ml, 1L, 1.5L, 2L</p>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black digital-menu-text-gray uppercase tracking-widest border-b border-slate-100 pb-1">Cervejas</p>
                    <p className="text-xs digital-menu-text-gray font-bold italic opacity-70">Skol, Heineken, Brahma</p>
                </div>
            </div>
        );
    };

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
        <div className="min-h-screen bg-white pb-32 overflow-x-hidden">
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
                <div className="absolute top-1/4 left-6 text-white text-shadow-lg z-10 pointer-events-none">
                    <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] uppercase italic">
                        JC Restaurantes
                    </h1>
                    <p className="text-base flex items-center gap-2 opacity-95 text-white font-black mt-3 drop-shadow-lg">
                        <span className="material-symbols-outlined text-red-600 bg-white rounded-full p-0.5 text-sm font-bold">location_on</span>
                        Jd das Camélias, São Paulo
                    </p>
                </div>
            </div>

            {/* Main Content Overlapping the Banner - TABS MODE */}
            <div className="relative -mt-32 z-20 bg-white rounded-t-[40px] px-4 pt-8 shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.25)] pb-10 min-h-screen">

                {/* Categories Navigation - NOW ALWAYS STICKY AT TOP OF THE CARD */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md -mx-4 px-4 pb-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-6 py-3 rounded-full text-sm font-black transition-all whitespace-nowrap shadow-sm border ${activeCategory === cat
                                    ? 'bg-red-600 text-white border-red-600 scale-105'
                                    : 'bg-slate-50 text-red-600 border-slate-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Category Title */}
                <div className="mt-8 mb-6 border-b-2 border-red-500/10 pb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-600 text-2xl">
                        {activeCategory === 'Refeições' ? 'restaurant' :
                            activeCategory === 'Para Levar' ? 'takeout_dining' :
                                activeCategory === 'Porções' ? 'bakery_dining' :
                                    activeCategory === 'Bebidas' ? 'local_bar' : 'icecream'}
                    </span>
                    <h2 className="text-2xl font-black digital-menu-text-dark tracking-tighter uppercase italic">
                        {activeCategory} {activeCategory === 'Refeições' ? '(Meals)' :
                            activeCategory === 'Para Levar' ? '(Takeaway)' :
                                activeCategory === 'Porções' ? '(Sides)' :
                                    activeCategory === 'Bebidas' ? '(Drinks)' : ''}
                    </h2>
                </div>

                {/* Tab Content Rendering */}
                <div className="transition-all duration-500">
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
