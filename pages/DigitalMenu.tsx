
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
        const element = document.getElementById(cat);
        if (element) {
            const offset = 80;
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
            {/* Header Banner Fixo (Visual Bistrô/Self-Service) */}
            <div className="relative h-[480px] w-full">
                <img
                    src="https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                    alt="JC Restaurantes - Self Service"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Restaurant Info */}
                <div className="absolute top-1/4 left-6 text-white text-shadow-lg z-10">
                    <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
                        JC Restaurantes
                    </h1>
                    <p className="text-sm flex items-center gap-1 opacity-90 text-white font-semibold mt-2 drop-shadow-md">
                        <span className="material-symbols-outlined text-sm text-white">location_on</span>
                        Jd das Camélias, São Paulo
                    </p>
                </div>
            </div>

            {/* Main Content Overlapping the Banner */}
            <div className="relative -mt-32 z-20 bg-white rounded-t-[40px] px-4 pt-8 shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.15)] pb-10">

                {/* Categories Navigation inside the overlapping card */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm -mx-4 px-4 pb-4">
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

                {/* Menu Content */}
                <div className="space-y-12 mt-4">
                    {categories.map((category) => (
                        <section key={category} id={category} className="space-y-6 scroll-mt-24">
                            <div className="flex items-center gap-3 border-b-2 border-red-500/10 pb-3">
                                <span className="material-symbols-outlined text-red-600 text-2xl">
                                    {category === 'Refeições' ? 'restaurant' :
                                        category === 'Para Levar' ? 'takeout_dining' :
                                            category === 'Porções' ? 'bakery_dining' :
                                                category === 'Bebidas' ? 'local_bar' : 'icecream'}
                                </span>
                                <h2 className="text-2xl font-black digital-menu-text-dark tracking-tight">
                                    {category} {category === 'Refeições' ? '(Meals)' :
                                        category === 'Para Levar' ? '(Takeaway)' :
                                            category === 'Porções' ? '(Sides)' :
                                                category === 'Bebidas' ? '(Drinks)' : ''}
                                </h2>
                            </div>

                            <div className="space-y-4 px-1">
                                {itemsByCategory(category).length > 0 ? (
                                    itemsByCategory(category).map((item) => {
                                        const isFeatured = item.description?.toLowerCase().includes('wed & sat') || item.name.toLowerCase().includes('feijoada');

                                        return (
                                            <div
                                                key={item.id}
                                                className={`flex justify-between gap-4 p-5 rounded-2xl transition-all ${isFeatured
                                                        ? 'bg-red-50/40 border-l-[6px] border-red-600 shadow-sm'
                                                        : 'bg-white border border-slate-50 shadow-sm'
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
                                                    <p className="text-xs digital-menu-text-gray mt-2 font-medium leading-relaxed italic opacity-75">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <div className="text-right flex flex-col justify-start">
                                                    <span className="digital-menu-text-red font-black text-xl tracking-tighter">
                                                        {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm digital-menu-text-gray italic opacity-50 px-4">
                                        Nenhum item nesta categoria disponível hoje.
                                    </p>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="bg-slate-900 text-white p-12 pb-44 border-t-4 border-red-600">
                <h2 className="text-2xl font-black text-red-600 text-center mb-8 tracking-tighter uppercase italic">JC Restaurantes</h2>
                <div className="space-y-8 max-w-sm mx-auto">
                    <div className="flex items-start gap-5">
                        <div className="bg-red-600 p-3 rounded-2xl shadow-lg">
                            <span className="material-symbols-outlined text-white text-2xl">call</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">Contatos</p>
                            <p className="text-xl font-bold text-white">(11) 99784-9852</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5">
                        <div className="bg-red-600 p-3 rounded-2xl shadow-lg">
                            <span className="material-symbols-outlined text-white text-2xl">location_on</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">Endereço</p>
                            <p className="text-base font-bold leading-relaxed text-white">
                                Av. Laranja da China 275 - Jd das Camélias
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Cart Button */}
            <button className="fixed bottom-28 right-6 bg-red-600 text-white p-5 rounded-full shadow-2xl z-50 transform transition-all active:scale-95 border-4 border-white">
                <span className="material-symbols-outlined text-3xl text-white">shopping_cart</span>
            </button>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-12 py-5 flex justify-between items-center z-40 backdrop-blur-lg bg-white/95">
                <button className="flex flex-col items-center gap-1 text-red-600">
                    <span className="material-symbols-outlined fill text-3xl text-red-600">menu_book</span>
                    <span className="text-[11px] font-black uppercase tracking-tighter">Cardápio</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 text-slate-400 group">
                    <span className="material-symbols-outlined text-3xl digital-menu-text-gray group-hover:text-red-400">map</span>
                    <span className="text-[11px] font-black uppercase tracking-tighter digital-menu-text-gray group-hover:text-red-400">Mapa</span>
                </button>
            </div>
        </div>
    );
};

export default DigitalMenu;
