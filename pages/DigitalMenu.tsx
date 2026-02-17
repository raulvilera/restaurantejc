
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';

const DigitalMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBannerCompact, setIsBannerCompact] = useState(false);

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
        setIsBannerCompact(true);
        const element = document.getElementById(cat);
        if (element) {
            const offset = 120;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header Banner Dinâmico */}
            <div
                className={`relative transition-all duration-700 ease-in-out w-full overflow-hidden ${isBannerCompact ? 'h-[180px]' : 'h-[450px]'
                    }`}
            >
                <img
                    src="https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                    alt="JC Restaurantes - Self Service"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Restaurant Info */}
                <div className={`absolute left-6 text-white transition-all duration-700 ${isBannerCompact ? 'top-6 translate-y-0 opacity-100' : 'top-1/2 -translate-y-1/2'
                    }`}>
                    <h1 className={`${isBannerCompact ? 'text-xl' : 'text-4xl'} font-black text-white tracking-tight transition-all duration-700`}>
                        JC Restaurantes
                    </h1>
                    {!isBannerCompact && (
                        <p className="text-sm flex items-center gap-1 opacity-90 text-white font-medium mt-1 animate-in fade-in duration-1000">
                            <span className="material-symbols-outlined text-sm text-white">location_on</span>
                            Jd das Camélias, São Paulo
                        </p>
                    )}
                </div>

                {/* Categories Navigation */}
                <div className={`absolute left-0 right-0 px-4 transition-all duration-700 ${isBannerCompact ? 'bottom-2' : 'bottom-6'
                    }`}>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-black border transition-all whitespace-nowrap shadow-md ${activeCategory === cat
                                        ? 'bg-red-600 text-white border-red-600 scale-105'
                                        : 'bg-white/95 text-red-600 border-white hover:bg-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Content */}
            <div className="px-4 mt-8 space-y-12">
                {categories.map((category) => (
                    <section key={category} id={category} className="space-y-6 scroll-mt-32">
                        <div className="flex items-center gap-3 border-b border-red-500/10 pb-3">
                            <span className="material-symbols-outlined text-red-600 text-2xl">
                                {category === 'Refeições' ? 'restaurant' :
                                    category === 'Para Levar' ? 'takeout_dining' :
                                        category === 'Porções' ? 'bakery_dining' :
                                            category === 'Bebidas' ? 'local_bar' : 'icecream'}
                            </span>
                            <h2 className="text-xl font-black digital-menu-text-dark tracking-tight">
                                {category} {category === 'Refeições' ? '(Meals)' :
                                    category === 'Para Levar' ? '(Takeaway)' :
                                        category === 'Porções' ? '(Sides)' :
                                            category === 'Bebidas' ? '(Drinks)' : ''}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {itemsByCategory(category).length > 0 ? (
                                itemsByCategory(category).map((item) => {
                                    const isFeatured = item.description?.toLowerCase().includes('wed & sat') || item.name.toLowerCase().includes('feijoada');

                                    return (
                                        <div
                                            key={item.id}
                                            className={`flex justify-between gap-4 p-4 rounded-xl transition-all ${isFeatured
                                                    ? 'bg-red-50/50 border-l-4 border-red-600 shadow-sm'
                                                    : 'bg-white border-b border-slate-100 last:border-0'
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold digital-menu-text-dark text-lg leading-tight uppercase tracking-tight">
                                                        {item.name}
                                                    </h3>
                                                    {isFeatured && (
                                                        <span className="bg-red-600 text-[8px] text-white font-black px-1.5 py-0.5 rounded-sm uppercase italic tracking-tighter">
                                                            WED & SAT
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs digital-menu-text-gray mt-1.5 font-medium leading-relaxed italic opacity-80">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <div className="text-right flex flex-col justify-start">
                                                <span className="digital-menu-text-red font-black text-lg tracking-tighter">
                                                    {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm digital-menu-text-gray italic opacity-50 px-4">
                                    Nenhum item disponível nesta categoria.
                                </p>
                            )}
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer Info Compacto */}
            <div className="mt-16 bg-slate-900 text-white p-8 pb-32">
                <div className="max-w-sm mx-auto space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-red-600">call</span>
                        <p className="text-sm font-bold text-white">(11) 99784-9852</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-red-600">location_on</span>
                        <p className="text-xs font-bold text-white">Av. Laranja da China 275 - Jd Camélias</p>
                    </div>
                </div>
            </div>

            {/* Botão Carrinho Fixo */}
            <button className="fixed bottom-24 right-4 bg-red-600 text-white p-4 rounded-full shadow-2xl z-50 border-4 border-white">
                <span className="material-symbols-outlined text-2xl text-white">shopping_cart</span>
            </button>

            {/* Nav Inferior */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-10 py-4 flex justify-between items-center z-40">
                <button className="flex flex-col items-center gap-1 text-red-600">
                    <span className="material-symbols-outlined fill text-2xl">menu_book</span>
                    <span className="text-[10px] font-black uppercase">Cardápio</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined text-2xl">map</span>
                    <span className="text-[10px] font-black uppercase">Mapa</span>
                </button>
            </div>
        </div>
    );
};

export default DigitalMenu;
